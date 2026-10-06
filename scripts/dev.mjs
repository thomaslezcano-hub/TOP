#!/usr/bin/env node
/**
 * Dev server, zero dependencies: builds, serves dist/ on http://localhost:4321
 * and rebuilds when anything in src/, public/ or site.config.mjs changes.
 *   npm run dev          → build + serve + watch
 *   npm start            → build + serve
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT) || 4321;
const watch = !process.argv.includes('--no-watch');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const build = () => spawnSync(process.execPath, [path.join(root, 'build.mjs')], { stdio: 'inherit' });
build();

http
  .createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (req.method === 'POST') {
      // Mimic Netlify Forms locally so the waitlist can be tested end to end.
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        console.log('  ✉ form submission:', body);
        res.writeHead(200).end('ok');
      });
      return;
    }
    let file = path.join(dist, url);
    if (!file.startsWith(dist)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`→ http://localhost:${port}${watch ? '  (watching for changes)' : ''}`));

if (watch) {
  let timer;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(build, 120);
  };
  for (const p of ['src', 'public']) fs.watch(path.join(root, p), { recursive: true }, rebuild);
  fs.watch(path.join(root, 'site.config.mjs'), rebuild);
}
