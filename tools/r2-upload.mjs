import { createReadStream } from 'node:fs';
import { lstat, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { S3Client } from '@aws-sdk/client-s3';
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
    const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
    values[match[1]] = value;
  }
  return values;
}

async function loadConfig() {
  const envPath = path.join(ROOT, '.env.r2');
  let env;
  try {
    env = parseEnv(await readFile(envPath, 'utf8'));
  } catch {
    throw new Error('Missing .env.r2. Copy .env.r2.example to .env.r2 and add your R2 settings.');
  }

  const required = ['R2_ACCOUNT_ID', 'R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) throw new Error(`Fill in these settings in .env.r2: ${missing.join(', ')}.`);

  let publicBaseUrl = '';
  if (env.R2_PUBLIC_BASE_URL) {
    let parsed;
    try {
      parsed = new URL(env.R2_PUBLIC_BASE_URL);
    } catch {
      throw new Error('R2_PUBLIC_BASE_URL must be an HTTPS custom domain URL.');
    }
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
      throw new Error('R2_PUBLIC_BASE_URL must be an HTTPS origin without credentials, a path, query, or fragment.');
    }
    publicBaseUrl = parsed.toString().replace(/\/+$/, '');
  }

  return { ...env, publicBaseUrl };
}

async function collectFiles(inputPaths) {
  const found = [];

  async function visit(targetPath) {
    const absolutePath = path.resolve(ROOT, targetPath);
    const relativePath = path.relative(ROOT, absolutePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      throw new Error(`Path must stay inside the project: ${targetPath}`);
    }

    const info = await lstat(absolutePath).catch(() => null);
    if (!info) throw new Error(`Path does not exist: ${targetPath}`);
    if (info.isSymbolicLink()) throw new Error(`Symbolic links are not uploaded: ${targetPath}`);
    if (info.isDirectory()) {
      const entries = await readdir(absolutePath, { withFileTypes: true });
      for (const entry of entries) {
        await visit(path.join(relativePath, entry.name));
      }
      return;
    }

    if (!info.isFile()) return;
    const extension = path.extname(absolutePath).toLowerCase();
    if (!MIME_TYPES[extension]) {
      throw new Error(`Unsupported media type: ${relativePath}`);
    }
    found.push({
      absolutePath,
      key: relativePath.split(path.sep).join('/'),
      size: info.size,
      contentType: MIME_TYPES[extension]
    });
  }

  for (const inputPath of inputPaths) await visit(inputPath);
  return found.sort((a, b) => a.key.localeCompare(b.key));
}

function formatBytes(bytes) {
  const mib = bytes / (1024 * 1024);
  return `${mib.toFixed(1)} MiB`;
}

async function writePublicConfig(publicBaseUrl) {
  if (!publicBaseUrl) return false;
  const configPath = path.join(ROOT, 'js', 'r2-config.js');
  const contents = [
    '// Public URL only. Keep R2 credentials in the ignored .env.r2 file.',
    `window.RUQYAH_R2_PUBLIC_URL = ${JSON.stringify(publicBaseUrl)};`,
    ''
  ].join('\n');
  await writeFile(configPath, contents, 'utf8');
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const inputPaths = args.filter((arg) => !arg.startsWith('--'));
  const config = await loadConfig();
  const files = await collectFiles(inputPaths.length ? inputPaths : DEFAULT_MEDIA_PATHS);

  if (!files.length) throw new Error('No supported media files were found to upload.');
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  console.log(`${dryRun ? 'R2 upload preview' : 'Uploading to R2'}: ${files.length} file(s), ${formatBytes(totalSize)} total.`);
  for (const file of files) {
    console.log(`  ${file.key} (${formatBytes(file.size)})`);
  }

  if (dryRun) return;

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.R2_ACCESS_KEY_ID,
      secretAccessKey: config.R2_SECRET_ACCESS_KEY
    }
  });

  let cursor = 0;
  let completed = 0;
  const errors = [];
  const worker = async () => {
    while (cursor < files.length) {
      const file = files[cursor++];
      try {
        const upload = new Upload({
          client,
          params: {
            Bucket: config.R2_BUCKET,
            Key: file.key,
            Body: createReadStream(file.absolutePath),
            ContentType: file.contentType,
            CacheControl: CACHE_CONTROL
          },
          partSize: 16 * 1024 * 1024,
          queueSize: 2,
          leavePartsOnError: false
        });
        await upload.done();
        completed += 1;
        console.log(`[${completed}/${files.length}] Uploaded ${file.key}`);
      } catch (error) {
        errors.push({ key: file.key, message: error?.message || 'Unknown upload error' });
        console.error(`Failed to upload ${file.key}: ${error?.message || 'Unknown upload error'}`);
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(2, files.length) }, worker));
  client.destroy();

  if (errors.length) {
    throw new Error(`${errors.length} upload(s) failed; the site URL was not switched to R2.`);
  }

  if (config.publicBaseUrl) {
    await writePublicConfig(config.publicBaseUrl);
    console.log(`Updated js/r2-config.js to use ${config.publicBaseUrl}. Commit and deploy the site to switch media delivery to R2.`);
  } else {
    console.log('Upload complete. Set R2_PUBLIC_BASE_URL to a connected public custom domain to switch the site to R2.');
  }
}

main().catch((error) => {
  console.error(`R2 upload stopped: ${error.message}`);
  process.exitCode = 1;
});
