import { createReadStream } from 'node:fs';
import { lstat, readdir, readFile } from 'node:fs/promises';
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

async function loadRawEnv() {
  const envPath = path.join(ROOT, '.env.e2');
  try {
    return parseEnv(await readFile(envPath, 'utf8'));
  } catch {
    throw new Error('Missing .env.e2. Copy .env.e2.example to .env.e2 and fill in your IDrive e2 credentials.');
  }
}

function resolveTargetConfig(env, target) {
  const isMilan = target === 'milan';
  const prefix = isMilan ? 'E2_MILAN_' : 'E2_';
  const label = isMilan ? 'Milan (eu-south-1)' : 'Singapore 2 (ap-southeast-2)';

  let endpoint = (env[`${prefix}ENDPOINT`] || (isMilan ? 'https://s3.eu-south-1.idrivee2.com' : env.E2_ENDPOINT || '')).trim();
  if (endpoint && !/^https?:\/\//i.test(endpoint)) {
    endpoint = `https://${endpoint}`;
  }

  const region = (env[`${prefix}REGION`] || (isMilan ? 'eu-south-1' : env.E2_REGION || 'ap-southeast-2')).trim();
  const bucket = (env[`${prefix}BUCKET`] || '').trim();
  const accessKeyId = (env[`${prefix}ACCESS_KEY_ID`] || env.E2_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = (env[`${prefix}SECRET_ACCESS_KEY`] || env.E2_SECRET_ACCESS_KEY || '').trim();

  if (!bucket) {
    throw new Error(
      `Missing bucket for ${label}. Set ${prefix}BUCKET in .env.e2 (e.g. ${isMilan ? 'E2_MILAN_BUCKET=ruqyah-media-milan' : 'E2_BUCKET=ruqyah-media'}).`
    );
  }
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(`Missing access keys for ${label} in .env.e2.`);
  }

  return { label, target: isMilan ? 'milan' : 'singapore', endpoint, region, bucket, accessKeyId, secretAccessKey };
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

async function syncTarget(config, files, { dryRun, listOnly }) {
  console.log(`\n========================================`);
  console.log(`IDrive e2 Target: ${config.label}`);
  console.log(`Endpoint: ${config.endpoint}`);
  console.log(`Bucket:   ${config.bucket}`);
  console.log(`========================================`);

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
    console.log(`Listing bucket '${config.bucket}'...`);
    try {
      const res = await client.send(new ListObjectsV2Command({ Bucket: config.bucket }));
      const contents = res.Contents || [];
      console.log(`Found ${contents.length} file(s) in '${config.bucket}':`);
      contents.forEach(c => console.log(`  ${c.Key} (${formatMiB(c.Size)})`));
    } catch (err) {
      console.error(`Failed to list bucket '${config.bucket}': ${err.message}`);
    }
    client.destroy();
    return;
  }

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  console.log(`Syncing: ${files.length} media file(s), ${formatMiB(totalBytes)} total.`);

  if (dryRun) {
    console.log(`(Dry run mode for ${config.label}: no files uploaded)`);
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
      console.log(`[${completed}/${files.length}] Uploaded: ${file.key} (${formatMiB(file.size)})`);
    } catch (err) {
      failed++;
      console.error(`Failed ${file.key}: ${err.message}`);
    }
  }

  client.destroy();

  if (failed > 0) {
    console.log(`⚠️ Finished ${config.label} with issues: ${completed} uploaded, ${failed} failed.`);
  } else {
    console.log(`🎉 ${config.label} Sync Complete! (${completed}/${files.length} uploaded)`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const listOnly = args.includes('--list');

  // Parse target: --milan, --singapore, --all, --target=milan, etc.
  let target = 'singapore';
  if (args.includes('--milan') || args.includes('--target=milan') || args.includes('--region=milan')) {
    target = 'milan';
  } else if (args.includes('--all') || args.includes('--target=all')) {
    target = 'all';
  } else if (args.includes('--singapore') || args.includes('--target=singapore') || args.includes('--region=singapore')) {
    target = 'singapore';
  }

  const customPaths = args.filter(a => !a.startsWith('--'));
  const env = await loadRawEnv();

  const pathsToScan = customPaths.length ? customPaths : DEFAULT_MEDIA_PATHS;
  const files = await collectFiles(pathsToScan);

  if (!listOnly && !files.length) {
    console.log('No matching media files found to sync.');
    return;
  }

  if (target === 'all') {
    const targets = [resolveTargetConfig(env, 'singapore'), resolveTargetConfig(env, 'milan')];
    for (const cfg of targets) {
      await syncTarget(cfg, files, { dryRun, listOnly });
    }
  } else {
    const cfg = resolveTargetConfig(env, target);
    await syncTarget(cfg, files, { dryRun, listOnly });
  }
}

main().catch(err => {
  console.error(`IDrive e2 Error: ${err.message}`);
  process.exitCode = 1;
});
