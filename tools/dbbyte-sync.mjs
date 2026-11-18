import { createReadStream } from 'node:fs';
import { lstat, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA_PATHS = [
  'assets/videos',
  'assets/allah-background-videos',
  'assets/audio',
  'assets/pdf'
];

const MIME_TYPES = {
  '.m4a': 'audio/mp4',
  '.m4v': 'video/mp4',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.wav': 'audio/wav',
  '.webm': 'video/webm'
};

const CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';

function parseEnv(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1].startsWith('#')) continue;
    values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return values;
}

async function loadConfig() {
  const envPath = path.join(ROOT, '.env.dbbyte');
  let env;
  try {
    env = parseEnv(await readFile(envPath, 'utf8'));
  } catch {
    throw new Error('Missing .env.dbbyte. Copy .env.dbbyte.example to .env.dbbyte and fill in your DBByte settings.');
  }

  const required = ['DBBYTE_ENDPOINT', 'DBBYTE_BUCKET', 'DBBYTE_ACCESS_KEY_ID', 'DBBYTE_SECRET_ACCESS_KEY'];
  const missing = required.filter(k => !env[k]);
  if (missing.length) {
    throw new Error(`Missing settings in .env.dbbyte: ${missing.join(', ')}. Please obtain these from https://dashboard.dbbyte.com/`);
  }

  let endpoint = env.DBBYTE_ENDPOINT.trim();
  if (!/^https?:\/\//i.test(endpoint)) endpoint = `https://${endpoint}`;

  let publicBaseUrl = (env.DBBYTE_PUBLIC_BASE_URL || '').trim();
  if (publicBaseUrl) {
    publicBaseUrl = publicBaseUrl.replace(/\/+$/, '');
  }

  return {
    endpoint,
    region: (env.DBBYTE_REGION || 'us-east-1').trim(),
    bucket: env.DBBYTE_BUCKET.trim(),
    accessKeyId: env.DBBYTE_ACCESS_KEY_ID.trim(),
    secretAccessKey: env.DBBYTE_SECRET_ACCESS_KEY.trim(),
    publicBaseUrl
  };
}

async function writePublicConfig(publicBaseUrl) {
  if (!publicBaseUrl) {
    throw new Error('DBBYTE_PUBLIC_BASE_URL must be defined in .env.dbbyte to switch site media.');
  }
  const configPath = path.join(ROOT, 'js', 'r2-config.js');
  const contents = [
    '// Public URL only. Keep DBByte / R2 credentials in the ignored .env.* files.',
    `window.RUQYAH_R2_PUBLIC_URL = ${JSON.stringify(publicBaseUrl)};`,
    ''
  ].join('\n');
  await writeFile(configPath, contents, 'utf8');
}

async function collectFiles() {
  const found = [];
  async function visit(target) {
    const abs = path.resolve(ROOT, target);
    const rel = path.relative(ROOT, abs);
    const info = await lstat(abs).catch(() => null);
    if (!info) return;
    if (info.isDirectory()) {
      for (const e of await readdir(abs, { withFileTypes: true })) {
        await visit(path.join(rel, e.name));
      }
      return;
    }
    if (!info.isFile()) return;
    const ext = path.extname(abs).toLowerCase();
    if (MIME_TYPES[ext]) {
      found.push({
        absolutePath: abs,
        key: rel.split(path.sep).join('/'),
        size: info.size,
        contentType: MIME_TYPES[ext]
      });
    }
  }
  for (const p of MEDIA_PATHS) await visit(p);
  return found.sort((a, b) => a.key.localeCompare(b.key));
}

function formatMiB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1) + ' MiB';
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const listOnly = args.includes('--list');
  const switchSite = args.includes('--switch-site');

  const config = await loadConfig();

  if (switchSite) {
    await writePublicConfig(config.publicBaseUrl);
    console.log(`✅ Updated js/r2-config.js to use DBByte public CDN: ${config.publicBaseUrl}`);
    return;
  }

  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  });

  if (listOnly) {
    console.log(`Listing DBByte bucket: ${config.bucket}...`);
    const res = await client.send(new ListObjectsV2Command({ Bucket: config.bucket }));
    const contents = res.Contents || [];
    console.log(`Found ${contents.length} file(s) in DBByte bucket:`);
    contents.forEach(c => console.log(`  ${c.Key} (${formatMiB(c.Size)})`));
    client.destroy();
    return;
  }

  const files = await collectFiles();
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  console.log(`DBByte S3 Sync: ${files.length} media file(s), ${formatMiB(totalBytes)} total.`);

  if (dryRun) {
    console.log('Dry run complete. No files were uploaded.');
    client.destroy();
    return;
  }

  let completed = 0;
  for (const file of files) {
    try {
      const upload = new Upload({
        client,
        params: {
          Bucket: config.bucket,
          Key: file.key,
          Body: createReadStream(file.absolutePath),
          ContentType: file.contentType,
          CacheControl: CACHE_CONTROL
        },
        partSize: 10 * 1024 * 1024,
        queueSize: 2
      });
      await upload.done();
      completed++;
      console.log(`[${completed}/${files.length}] Uploaded to DBByte: ${file.key}`);
    } catch (err) {
      console.error(`Failed ${file.key}: ${err.message}`);
    }
  }

  client.destroy();
  console.log(`\n🎉 DBByte Sync Complete! (${completed}/${files.length} uploaded)`);

  if (config.publicBaseUrl) {
    await writePublicConfig(config.publicBaseUrl);
    console.log(`✅ Pointed site to DBByte CDN URL: ${config.publicBaseUrl}`);
  }
}

main().catch(err => {
  console.error(`DBByte Sync Error: ${err.message}`);
  process.exitCode = 1;
});
