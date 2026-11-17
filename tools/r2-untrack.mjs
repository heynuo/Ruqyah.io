import { execFileSync } from 'node:child_process';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA_DIRS = [
  'assets/videos',
  'assets/allah-background-videos',
  'assets/audio',
  'assets/pdf'
];
const MEDIA_EXTENSIONS = new Set(['.m4a', '.m4v', '.mov', '.mp3', '.mp4', '.pdf', '.wav', '.webm']);

function parseEnv(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1].startsWith('#')) continue;
    values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return values;
}

async function readConfig() {
  let env;
  try {
    env = parseEnv(await readFile(path.join(ROOT, '.env.r2'), 'utf8'));
  } catch {
    throw new Error('Missing .env.r2. Copy .env.r2.example to .env.r2 and add your R2 settings.');
  }

  const required = ['R2_ACCOUNT_ID', 'R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_BASE_URL'];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) throw new Error(`Fill in these settings in .env.r2: ${missing.join(', ')}.`);

  const configSource = await readFile(path.join(ROOT, 'js', 'r2-config.js'), 'utf8');
  const publicBaseUrl = new URL(env.R2_PUBLIC_BASE_URL).toString().replace(/\/+$/, '');
  if (!configSource.includes(publicBaseUrl)) {
    throw new Error('The public media URL is not enabled in js/r2-config.js. Upload the media first and verify the site URL.');
  }
  return env;
}

async function listMediaFiles() {
  const files = [];
  async function visit(relativePath) {
    const absolutePath = path.join(ROOT, relativePath);
    const info = await stat(absolutePath).catch(() => null);
    if (!info) return;
    if (info.isDirectory()) {
      for (const entry of await readdir(absolutePath, { withFileTypes: true })) {
        await visit(path.join(relativePath, entry.name));
      }
      return;
    }
    if (info.isFile() && MEDIA_EXTENSIONS.has(path.extname(absolutePath).toLowerCase())) {
      files.push(relativePath.split(path.sep).join('/'));
    }
  }
  for (const directory of MEDIA_DIRS) await visit(directory);
  return files;
}

async function main() {
  const config = await readConfig();
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.R2_ACCESS_KEY_ID,
      secretAccessKey: config.R2_SECRET_ACCESS_KEY
    }
  });

  const files = await listMediaFiles();
  const missing = [];
  for (const key of files) {
    try {
      await client.send(new HeadObjectCommand({ Bucket: config.R2_BUCKET, Key: key }));
    } catch {
      missing.push(key);
      console.error(`Not found in R2; keeping it in GitHub: ${key}`);
    }
  }
  client.destroy();

  if (missing.length) {
    throw new Error(`${missing.length} local media file(s) are not present in R2. No Git files were changed.`);
  }

  const tracked = execFileSync('git', ['ls-files', '--', ...MEDIA_DIRS], { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
  if (!tracked.length) {
    console.log('No tracked media files found.');
    return;
  }

  execFileSync('git', ['rm', '--cached', '-r', '--', ...MEDIA_DIRS], { cwd: ROOT, stdio: 'inherit' });
  console.log(`Removed ${tracked.length} media file(s) from Git tracking. The local originals remain on disk.`);
}

main().catch((error) => {
  console.error(`R2 untrack stopped: ${error.message}`);
  process.exitCode = 1;
});
