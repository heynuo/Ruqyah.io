import { readFile, writeFile } from 'node:fs/promises';
import { lstat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_MEDIA_PATHS = [
  'assets/videos',
  'assets/allah-background-videos',
  'assets/audio',
  'assets/pdf'
];

const SUPPORTED_EXTENSIONS = new Set([
  '.m4a', '.m4v', '.mov', '.mp3', '.mp4', '.pdf', '.wav', '.webm',
  '.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'
]);

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
  const envPath = path.join(ROOT, '.env.imagekit');
  try {
    return parseEnv(await readFile(envPath, 'utf8'));
  } catch {
    throw new Error('Missing .env.imagekit. Copy .env.imagekit.example to .env.imagekit and fill in your ImageKit API keys.');
  }
}

function resolveAccountConfig(env, accountId = 1) {
  const num = parseInt(accountId, 10) || 1;
  const defaults = {
    1: { prefix: 'IMAGEKIT_', endpoint: 'https://ik.imagekit.io/fjx6vpmqa', id: 'fjx6vpmqa' },
    2: { prefix: 'IMAGEKIT_2_', endpoint: 'https://ik.imagekit.io/6vyidckdo', id: '6vyidckdo' },
    3: { prefix: 'IMAGEKIT_3_', endpoint: 'https://ik.imagekit.io/wwj3gmj12', id: 'wwj3gmj12' },
    4: { prefix: 'IMAGEKIT_4_', endpoint: 'https://ik.imagekit.io/ofapqtlnv', id: 'ofapqtlnv' }
  };
  const meta = defaults[num] || { prefix: `IMAGEKIT_${num}_`, endpoint: '', id: `Account ${num}` };
  const label = `Account ${num} (${meta.id})`;
  const prefix = meta.prefix;

  const privateKey = (env[`${prefix}PRIVATE_KEY`] || '').trim();
  const publicKey = (env[`${prefix}PUBLIC_KEY`] || '').trim();
  const urlEndpoint = (env[`${prefix}URL_ENDPOINT`] || meta.endpoint).trim();

  if (!privateKey) {
    throw new Error(`Missing ${prefix}PRIVATE_KEY in .env.imagekit.`);
  }

  return {
    accountId: num,
    label,
    publicKey,
    privateKey,
    urlEndpoint: urlEndpoint.replace(/\/+$/, ''),
    authHeader: 'Basic ' + Buffer.from(privateKey + ':').toString('base64')
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
    if (SUPPORTED_EXTENSIONS.has(ext)) {
      found.push({
        absolutePath: abs,
        key: rel.split(path.sep).join('/'),
        folder: '/' + path.dirname(rel).split(path.sep).join('/'),
        fileName: path.basename(abs),
        size: info.size
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

async function writePublicConfig(urlEndpoint) {
  if (!urlEndpoint) return;
  const configPath = path.join(ROOT, 'js', 'r2-config.js');
  const contents = [
    '// Media delivery CDN endpoint (ImageKit / R2)',
    `window.RUQYAH_R2_PUBLIC_URL = ${JSON.stringify(urlEndpoint)};`,
    ''
  ].join('\n');
  await writeFile(configPath, contents, 'utf8');
}

async function listFiles(config) {
  console.log(`\n========================================`);
  console.log(`Listing files for ${config.label}`);
  console.log(`Endpoint: ${config.urlEndpoint}`);
  console.log(`========================================`);

  const foldersToInspect = ['/', '/assets/videos', '/assets/allah-background-videos', '/assets/audio', '/assets/pdf'];
  let totalFound = 0;

  for (const folder of foldersToInspect) {
    try {
      const res = await fetch(`https://api.imagekit.io/v1/files?path=${encodeURIComponent(folder)}&limit=100`, {
        headers: { Authorization: config.authHeader }
      });
      if (res.ok) {
        const files = await res.json();
        if (files.length > 0) {
          console.log(`\nFolder: ${folder} (${files.length} file(s)):`);
          files.forEach(f => {
            totalFound++;
            console.log(`  ${f.filePath || f.name} (${formatMiB(f.size || 0)}) -> ${f.url}`);
          });
        }
      }
    } catch {
      // ignore
    }
  }

  if (totalFound === 0) {
    console.log('No files found in ImageKit media library.');
  }
}

async function uploadFile(config, file) {
  const fileBuffer = await readFile(file.absolutePath);
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), file.fileName);
  formData.append('fileName', file.fileName);
  formData.append('folder', file.folder);
  formData.append('useUniqueFileName', 'false');

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: {
      Authorization: config.authHeader
    },
    body: formData
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed (${res.status}): ${err}`);
  }

  return await res.json();
}

async function syncAccount(config, files, { dryRun }) {
  console.log(`\n========================================`);
  console.log(`ImageKit Target: ${config.label}`);
  console.log(`CDN Endpoint:   ${config.urlEndpoint}`);
  console.log(`========================================`);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  console.log(`Syncing: ${files.length} media file(s), ${formatMiB(totalBytes)} total.`);

  if (dryRun) {
    console.log(`(Dry run mode for ${config.label}: no files uploaded)`);
    return;
  }

  let completed = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const result = await uploadFile(config, file);
      completed++;
      console.log(`[${completed}/${files.length}] Uploaded: ${file.key} (${formatMiB(file.size)})`);
      if (result.url) {
        console.log(`     CDN URL: ${result.url}`);
      }
    } catch (err) {
      failed++;
      console.error(`Failed ${file.key}: ${err.message}`);
    }
  }

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
  const switchSite = args.includes('--switch-site');

  let accountNum = 1;
  let syncAll = false;

  if (args.includes('--account=4') || args.includes('--4') || args.includes('--account4')) {
    accountNum = 4;
  } else if (args.includes('--account=3') || args.includes('--3') || args.includes('--account3')) {
    accountNum = 3;
  } else if (args.includes('--account=2') || args.includes('--2') || args.includes('--account2')) {
    accountNum = 2;
  } else if (args.includes('--all') || args.includes('--target=all')) {
    syncAll = true;
  }

  const customPaths = args.filter(a => !a.startsWith('--'));
  const env = await loadRawEnv();

  if (switchSite) {
    const cfg = resolveAccountConfig(env, accountNum);
    await writePublicConfig(cfg.urlEndpoint);
    console.log(`✅ Updated js/r2-config.js to use ImageKit ${cfg.label}: ${cfg.urlEndpoint}`);
    return;
  }

  if (listOnly) {
    if (syncAll) {
      for (const a of [1, 2, 3, 4]) {
        try {
          await listFiles(resolveAccountConfig(env, a));
        } catch (e) {
          console.warn(`Could not list Account ${a}: ${e.message}`);
        }
      }
    } else {
      await listFiles(resolveAccountConfig(env, accountNum));
    }
    return;
  }

  const pathsToScan = customPaths.length ? customPaths : DEFAULT_MEDIA_PATHS;
  const files = await collectFiles(pathsToScan);

  if (!files.length) {
    console.log('No supported media files found to sync.');
    return;
  }

  if (syncAll) {
    for (const a of [1, 2, 3, 4]) {
      try {
        await syncAccount(resolveAccountConfig(env, a), files, { dryRun });
      } catch (e) {
        console.error(`Failed to sync Account ${a}: ${e.message}`);
      }
    }
  } else {
    await syncAccount(resolveAccountConfig(env, accountNum), files, { dryRun });
  }
}

main().catch(err => {
  console.error(`ImageKit Error: ${err.message}`);
  process.exitCode = 1;
});
