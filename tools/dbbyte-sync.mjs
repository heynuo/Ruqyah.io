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

async function loadRawEnv() {
  const envPath = path.join(ROOT, '.env.dbbyte');
  try {
    return parseEnv(await readFile(envPath, 'utf8'));
  } catch {
    throw new Error('Missing .env.dbbyte file. Copy .env.dbbyte.example to .env.dbbyte and add your keys.');
  }
}

function getAccountConfig(env, accountNum = 1) {
  const prefix = accountNum === 1 ? 'DBBYTE_' : `DBBYTE_${accountNum}_`;
  const apiKey = (env[`${prefix}API_KEY`] || (accountNum === 1 ? env.DBBYTE_SECRET_ACCESS_KEY : '') || '').trim();
  const bucket = (env[`${prefix}BUCKET`] || '').trim();
  const region = (env[`${prefix}REGION`] || 'us-east-1').trim();
  const cdnUrl = (env[`${prefix}PUBLIC_BASE_URL`] || '').trim().replace(/\/+$/, '');

  if (!apiKey || !bucket) {
    throw new Error(`Missing ${prefix}API_KEY or ${prefix}BUCKET in .env.dbbyte`);
  }

  return { accountNum, apiKey, bucket, region, cdnUrl, label: `Account ${accountNum} [${bucket}]` };
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

async function syncAccount(cfg, files, { dryRun = false, listOnly = false } = {}) {
  console.log(`\n========================================`);
  console.log(`Connecting to ${cfg.label} (${cfg.region})...`);
  console.log(`========================================`);

  const bucketRes = await fetch(`https://api.dbbyte.com/buckets/${cfg.bucket}`, {
    headers: { 'Authorization': `Bearer ${cfg.apiKey}` }
  });

  if (!bucketRes.ok) {
    const errText = await bucketRes.text();
    throw new Error(`Failed to access bucket "${cfg.bucket}" (${bucketRes.status}): ${errText}`);
  }

  const { bucket: bucketInfo } = await bucketRes.json();
  console.log(`Bucket verified: ${bucketInfo.name}`);
  console.log(`  - Visibility: ${bucketInfo.isPublic ? 'Public' : 'Private'}`);
  console.log(`  - CDN Enabled: ${bucketInfo.cdn}`);
  console.log(`  - Files currently in bucket: ${bucketInfo.fileCount}`);

  // Auto-enable public and CDN if not enabled
  if (!bucketInfo.isPublic || !bucketInfo.cdn) {
    console.log('Ensuring bucket is set to Public with CDN enabled...');
    await fetch(`https://api.dbbyte.com/buckets/${cfg.bucket}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${cfg.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isPublic: true, cdn: true })
    });
  }

  if (listOnly) {
    const listRes = await fetch(`https://api.dbbyte.com/storage/${cfg.bucket}/list`, {
      headers: { 'Authorization': `Bearer ${cfg.apiKey}` }
    });
    if (!listRes.ok) throw new Error(`List failed: ${await listRes.text()}`);
    const data = await listRes.json();
    console.log(`Files in ${cfg.bucket} (${data.files ? data.files.length : 0} items):`);
    (data.files || []).forEach(f => console.log(`  - ${f.name} (${formatMiB(f.size)})`));
    return;
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  console.log(`Prepared ${files.length} media file(s) for upload (${formatMiB(totalSize)} total).`);

  if (dryRun) {
    console.log('Dry run complete. No files were uploaded.');
    return;
  }

  let uploaded = 0;
  for (const file of files) {
    console.log(`[${uploaded + 1}/${files.length}] Uploading to ${cfg.bucket}: ${file.key} (${formatMiB(file.size)})...`);
    const fileBlob = new Blob([await readFile(file.absolutePath)], { type: file.mimeType });
    const form = new FormData();
    form.append('file', fileBlob, file.name);

    const uploadRes = await fetch(`https://api.dbbyte.com/storage/${cfg.bucket}/upload?overwrite=true`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${cfg.apiKey}` },
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

  console.log(`\n🎉 ${cfg.label} Sync Complete! (${uploaded}/${files.length} uploaded)`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const listOnly = args.includes('--list');
  const switchSite = args.includes('--switch-site');
  const syncAll = args.includes('--all');

  const accArg = args.find(a => a.startsWith('--account='));
  const targetAccount = accArg ? parseInt(accArg.split('=')[1], 10) : 1;

  const env = await loadRawEnv();

  if (switchSite) {
    const cfg = getAccountConfig(env, targetAccount);
    await writePublicConfig(cfg.cdnUrl);
    console.log(`✅ Pointed website media to DBByte ${cfg.label} CDN: ${cfg.cdnUrl}`);
    return;
  }

  if (listOnly) {
    if (syncAll) {
      for (const a of [1, 2, 3, 4]) {
        try {
          const cfg = getAccountConfig(env, a);
          await syncAccount(cfg, [], { listOnly: true });
        } catch (e) {
          console.warn(`Account ${a} skipped: ${e.message}`);
        }
      }
    } else {
      const cfg = getAccountConfig(env, targetAccount);
      await syncAccount(cfg, [], { listOnly: true });
    }
    return;
  }

  const files = await collectFiles();

  if (syncAll) {
    for (const a of [1, 2, 3, 4]) {
      try {
        const cfg = getAccountConfig(env, a);
        await syncAccount(cfg, files, { dryRun });
      } catch (e) {
        console.error(`Account ${a} sync error: ${e.message}`);
      }
    }
  } else {
    const cfg = getAccountConfig(env, targetAccount);
    await syncAccount(cfg, files, { dryRun });
  }
}

main().catch(err => {
  console.error(`DBByte Sync Error: ${err.message}`);
  process.exitCode = 1;
});
