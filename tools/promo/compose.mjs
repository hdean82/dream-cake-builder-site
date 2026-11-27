// Films stage.html frame by frame and encodes the promo.
// Usage: node tools/promo/compose.mjs <framesDir> <outDir> [--stills 2,6,12,...]
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { FPS, W, H, DURATION, shotList, frameName } from './plan.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const FR = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]);
const si = process.argv.indexOf('--stills'), STILLS = si > 0 ? process.argv[si + 1].split(',').map(Number) : null;
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const f = p.startsWith('/frames/') ? path.join(FR, p.slice(8)) : path.join(ROOT, p);
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404).end(); return; } res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); res.end(b); });
}).listen(8767);

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage();
page.on('pageerror', e => console.log('page error', String(e)));
await page.goto('http://localhost:8767/tools/promo/stage.html?frames=/frames/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.ready);
const names = Object.entries(shotList()).flatMap(([k, a]) => a.map(x => frameName(k, x))).filter(n => fs.existsSync(path.join(FR, n)));
await page.evaluate(n => window.preload(n), names);
console.log('Loaded', names.length, 'cake pictures');

if (STILLS) {
  for (const t of STILLS) { await page.evaluate(x => window.seek(x), t); await page.screenshot({ path: path.join(OUT, `still-${String(t).replace('.', '_')}.jpg`), type: 'jpeg', quality: 88 }); }
  console.log('Stills done');
} else {
  const TMP = path.join(OUT, 'f'); fs.mkdirSync(TMP, { recursive: true });
  const total = DURATION * FPS;
  for (let f = 0; f < total; f++) {
    await page.evaluate(x => window.seek(x), f / FPS);
    await page.screenshot({ path: path.join(TMP, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
    if (f % 150 === 0) console.log('frame', f, '/', total);
  }
  const tmpOut = path.join(OUT, 'dream-cake-builder-demo.tmp.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(TMP, '%05d.jpg'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', tmpOut]);
  fs.renameSync(tmpOut, path.join(OUT, 'dream-cake-builder-demo.mp4'));
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('Video done');
}
await browser.close(); server.close();
