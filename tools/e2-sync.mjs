import { createReadStream } from 'node:fs';
import { lstat, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_MEDIA_PATHS = [
  'assets/videos',
  'assets/allah-background-videos',
  'assets/audio',
  'assets/pdf'
];

const CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';

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
  const envPath = path.join(ROOT, '.env.e2');
  let env;
  try {
    env = parseEnv(await readFile(envPath, 'utf8'));
  } catch {
    throw new Error('Missing .env.e2. Copy .env.e2.example to .env.e2 and fill in your IDrive e2 credentials.');
  }

  const required = ['E2_ENDPOINT', 'E2_BUCKET', 'E2_ACCESS_KEY_ID', 'E2_SECRET_ACCESS_KEY'];
  const missing = required.filter(k => !env[k]);
  if (missing.length) {
    throw new Error(`Missing required settings in .env.e2: ${missing.join(', ')}`);
  }

  let endpoint = env.E2_ENDPOINT.trim();
  if (!/^https?:\/\//i.test(endpoint)) {
    endpoint = `https://${endpoint}`;
  }

  let publicBaseUrl = '';
  if (env.E2_PUBLIC_BASE_URL) {
    try {
      const parsed = new URL(env.E2_PUBLIC_BASE_URL.trim());
      publicBaseUrl = parsed.toString().replace(/\/+$/, '');
    } catch {
      console.warn('⚠️ Invalid E2_PUBLIC_BASE_URL; skipped public URL configuration.');
    }
  }

  return {
    endpoint,
    region: env.E2_REGION ? env.E2_REGION.trim() : 'ap-southeast-2',
    bucket: env.E2_BUCKET.trim(),
    accessKeyId: env.E2_ACCESS_KEY_ID.trim(),
    secretAccessKey: env.E2_SECRET_ACCESS_KEY.trim(),
    publicBaseUrl
  };
}

async function collectFiles(inputPaths) {
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

  for (const p of inputPaths) {
    await visit(p);
  }
  return found.sort((a, b) => a.key.localeCompare(b.key));
}

function formatMiB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1) + ' MiB';
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const listOnly = args.includes('--list');
  const customPaths = args.filter(a => !a.startsWith('--'));

  const config = await loadConfig();

  // IDrive e2 requires forcePathStyle: true for S3 compatibility
  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    },
    forcePathStyle: true
  });

  if (listOnly) {
    console.log(`Listing bucket '${config.bucket}' on IDrive e2 (${config.endpoint})...`);
    const res = await client.send(new ListObjectsV2Command({ Bucket: config.bucket }));
    const contents = res.Contents || [];
    console.log(`Found ${contents.length} file(s) in IDrive e2 bucket '${config.bucket}':`);
    contents.forEach(c => console.log(`  ${c.Key} (${formatMiB(c.Size)})`));
    client.destroy();
    return;
  }

  const pathsToScan = customPaths.length ? customPaths : DEFAULT_MEDIA_PATHS;
  const files = await collectFiles(pathsToScan);

  if (!files.length) {
    console.log('No matching media files found to sync.');
    client.destroy();
    return;
  }

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  console.log(`IDrive e2 Sync: ${files.length} media file(s), ${formatMiB(totalBytes)} total.`);

  if (dryRun) {
    console.log('\n--- Preview (Dry Run) ---');
    files.forEach(f => console.log(`  ${f.key} (${formatMiB(f.size)}) [${f.contentType}]`));
    console.log('\nDry run complete. No files were uploaded.');
    client.destroy();
    return;
  }

  let completed = 0;
  let failed = 0;

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
        queueSize: 2,
        leavePartsOnError: false
      });

      await upload.done();
      completed++;
      console.log(`[${completed}/${files.length}] Uploaded to IDrive e2: ${file.key} (${formatMiB(file.size)})`);
    } catch (err) {
      failed++;
      console.error(`Failed ${file.key}: ${err.message}`);
    }
  }

  client.destroy();

  if (failed > 0) {
    console.log(`\n⚠️ IDrive e2 Sync finished with issues: ${completed} uploaded, ${failed} failed.`);
  } else {
    console.log(`\n🎉 IDrive e2 Sync Complete! (${completed}/${files.length} uploaded)`);
  }
}

main().catch(err => {
  console.error(`IDrive e2 Error: ${err.message}`);
  process.exitCode = 1;
});
