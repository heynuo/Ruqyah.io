import { createReadStream } from 'node:fs';
import { lstat, readdir, readFile } from 'node:fs/promises';
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
  const envPath = path.join(ROOT, '.env.b2');
  let env;
  try {
    env = parseEnv(await readFile(envPath, 'utf8'));
  } catch {
    throw new Error('Missing .env.b2. Create .env.b2 with your Backblaze B2 settings.');
  }

  const required = ['B2_ENDPOINT', 'B2_BUCKET', 'B2_KEY_ID', 'B2_APPLICATION_KEY'];
  const missing = required.filter(k => !env[k]);
  if (missing.length) throw new Error(`Missing settings in .env.b2: ${missing.join(', ')}`);

  let endpoint = env.B2_ENDPOINT.trim();
  if (!/^https?:\/\//i.test(endpoint)) endpoint = `https://${endpoint}`;

  return {
    endpoint,
    region: env.B2_REGION || 'us-west-004',
    bucket: env.B2_BUCKET.trim(),
    keyId: env.B2_KEY_ID.trim(),
    appKey: env.B2_APPLICATION_KEY.trim()
  };
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

  const config = await loadConfig();

  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.keyId,
      secretAccessKey: config.appKey
    }
  });

  if (listOnly) {
    console.log(`Listing bucket: ${config.bucket}...`);
    const res = await client.send(new ListObjectsV2Command({ Bucket: config.bucket }));
    const contents = res.Contents || [];
    console.log(`Found ${contents.length} file(s) in Backblaze B2:`);
    contents.forEach(c => console.log(`  ${c.Key} (${formatMiB(c.Size)})`));
    client.destroy();
    return;
  }

  const files = await collectFiles();
  console.log(`Backblaze B2 Sync: ${files.length} media file(s), ${formatMiB(files.reduce((a,b)=>a+b.size,0))} total.`);

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
          ContentType: file.contentType
        },
        partSize: 10 * 1024 * 1024,
        queueSize: 2
      });
      await upload.done();
      completed++;
      console.log(`[${completed}/${files.length}] Uploaded to B2: ${file.key}`);
    } catch (err) {
      console.error(`Failed ${file.key}: ${err.message}`);
    }
  }

  client.destroy();
  console.log(`\n🎉 Backblaze B2 Sync Complete! (${completed}/${files.length} uploaded)`);
}

main().catch(err => {
  console.error(`B2 Sync Error: ${err.message}`);
  process.exitCode = 1;
});
