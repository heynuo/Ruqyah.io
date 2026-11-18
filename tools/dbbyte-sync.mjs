import { readFile, writeFile, lstat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  const envPath = path.join(ROOT, '.env.dbbyte');
  let env = {};
  try {
    env = parseEnv(await readFile(envPath, 'utf8'));
  } catch {
    throw new Error('Missing .env.dbbyte file. Please create it with DBBYTE_API_KEY.');
  }

  const apiKey = (env.DBBYTE_API_KEY || env.DBBYTE_SECRET_ACCESS_KEY || '').trim();
  if (!apiKey) {
    throw new Error('Missing DBBYTE_API_KEY in .env.dbbyte (format: dbk_...)');
  }

  const bucket = (env.DBBYTE_BUCKET || 'ruqyah-media').trim();
  const cdnUrl = (env.DBBYTE_PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '');

  return { apiKey, bucket, cdnUrl };
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
        name: rel.split(path.sep).join('/'),
        size: info.size,
        mimeType: MIME_TYPES[ext]
      });
    }
  }
  for (const p of MEDIA_PATHS) await visit(p);
  return found.sort((a, b) => a.key.localeCompare(b.key));
}

function formatMiB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1) + ' MiB';
}

async function writePublicConfig(publicBaseUrl) {
  if (!publicBaseUrl) {
    throw new Error('DBBYTE_PUBLIC_BASE_URL must be defined to switch site media.');
  }
  const configPath = path.join(ROOT, 'js', 'r2-config.js');
  const contents = [
    '// Public URL only. Keep DBByte / R2 credentials in the ignored .env.* files.',
    `window.RUQYAH_R2_PUBLIC_URL = ${JSON.stringify(publicBaseUrl)};`,
    ''
  ].join('\n');
  await writeFile(configPath, contents, 'utf8');
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const listOnly = args.includes('--list');
  const switchSite = args.includes('--switch-site');

  const { apiKey, bucket, cdnUrl } = await loadConfig();

  if (switchSite) {
    await writePublicConfig(cdnUrl);
    console.log(`✅ Pointed website media to DBByte CDN URL: ${cdnUrl}`);
    return;
  }

  console.log(`Connecting to DBByte API for bucket: "${bucket}"...`);
  const bucketRes = await fetch(`https://api.dbbyte.com/buckets/${bucket}`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });

  if (!bucketRes.ok) {
    const errText = await bucketRes.text();
    throw new Error(`Failed to access bucket "${bucket}" (${bucketRes.status}): ${errText}`);
  }

  const { bucket: bucketInfo } = await bucketRes.json();
  console.log(`Bucket found: ${bucketInfo.name} (${bucketInfo.region})`);
  console.log(`  - Visibility: ${bucketInfo.isPublic ? 'Public' : 'Private'}`);
  console.log(`  - CDN Enabled: ${bucketInfo.cdn}`);
  console.log(`  - Files currently in bucket: ${bucketInfo.fileCount}`);

  // Auto-enable public and CDN if not enabled
  if (!bucketInfo.isPublic || !bucketInfo.cdn) {
    console.log('Ensuring bucket is set to Public with CDN enabled...');
    await fetch(`https://api.dbbyte.com/buckets/${bucket}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isPublic: true, cdn: true })
    });
  }

  if (listOnly) {
    const listRes = await fetch(`https://api.dbbyte.com/storage/${bucket}/list`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (!listRes.ok) throw new Error(`List failed: ${await listRes.text()}`);
    const data = await listRes.json();
    console.log(`Files in ${bucket}:`);
    data.files.forEach(f => console.log(`  - ${f.name} (${formatMiB(f.size)})`));
    return;
  }

  const files = await collectFiles();
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  console.log(`\nPrepared ${files.length} media file(s) for upload (${formatMiB(totalSize)} total).`);

  if (dryRun) {
    console.log('Dry run complete. No files were uploaded.');
    return;
  }

  let uploaded = 0;
  for (const file of files) {
    console.log(`[${uploaded + 1}/${files.length}] Uploading: ${file.key} (${formatMiB(file.size)})...`);
    const fileBlob = new Blob([await readFile(file.absolutePath)], { type: file.mimeType });
    const form = new FormData();
    form.append('file', fileBlob, file.name);

    const uploadRes = await fetch(`https://api.dbbyte.com/storage/${bucket}/upload?overwrite=true`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: form
    });

    if (uploadRes.ok) {
      uploaded++;
      console.log(`  ✓ Success: ${file.key}`);
    } else {
      const err = await uploadRes.text();
      console.error(`  ✗ Failed ${file.key}: ${err}`);
    }
  }

  console.log(`\n🎉 DBByte Sync Complete! (${uploaded}/${files.length} uploaded)`);
  if (cdnUrl) {
    await writePublicConfig(cdnUrl);
    console.log(`✅ Pointed site to DBByte CDN URL: ${cdnUrl}`);
  }
}

main().catch(err => {
  console.error(`DBByte Sync Error: ${err.message}`);
  process.exitCode = 1;
});
