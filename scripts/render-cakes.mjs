// Renders the website's cake pictures (assets/home/cakes/<theme>.jpg/.webp) straight from the Studio,
// so a theme that changes in studio.html gets a matching picture everywhere on the site.
// Usage: node scripts/render-cakes.mjs [--all] [theme_key ...]
import {chromium} from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'assets/home/cakes');
const MANIFEST = path.join(OUT, 'manifest.json');
const args = process.argv.slice(2), force = args.includes('--all'), only = args.filter(a => !a.startsWith('--'));

const studio = fs.readFileSync(path.join(ROOT, 'studio.html'), 'utf8');
// Each theme's recipe, from "{key:'x'" to the next theme. Its hash tells us when the cake changed.
const themes = new Map();
const re = /\{key:'([a-z0-9_]+)'/g; const starts = [];
for (let m; (m = re.exec(studio));) starts.push([m[1], m.index]);
starts.forEach(([k, i], n) => { if (!themes.has(k)) themes.set(k, studio.slice(i, n + 1 < starts.length ? starts[n + 1][1] : i + 20000)); });
const hash = t => crypto.createHash('sha1').update(t).digest('hex').slice(0, 12);

const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
const pictured = fs.readdirSync(OUT).filter(f => f.endsWith('.jpg') && !f.endsWith('-pair.jpg')).map(f => f.slice(0, -4));
// New signature themes get a picture on their first run, so they can join the home page gallery.
const fresh = [...themes.keys()].filter(k => k.startsWith('sig_') && !pictured.includes(k));
let todo = (only.length ? only : [...pictured, ...fresh]).filter(k => themes.has(k));
if (!force && !only.length) todo = todo.filter(k => manifest[k] !== hash(themes.get(k)));
if (!todo.length) { console.log('All cake pictures are up to date.'); process.exit(0); }
console.log('Rendering:', todo.join(', '));

const TYPES = {'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.glb':'model/gltf-binary','.woff2':'font/woff2'};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  let f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404).end(); return; } res.writeHead(200, {'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream'}); res.end(b); });
}).listen(8765);

const browser = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']});
const ctx = await browser.newContext({viewport: {width: 900, height: 900}, deviceScaleFactor: 1});
let failed = 0;
for (const k of todo) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  try {
    await page.goto(`http://localhost:8765/studio.html?theme=${k}&view=1&shot=1`, {waitUntil: 'networkidle', timeout: 120000});
    // Wait until the cake is built, give its 3D pieces time to arrive, then frame it from the front.
    await page.waitForFunction(() => typeof window.__dcsFrame === 'function' && !document.getElementById('loading'), null, {timeout: 120000});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000);
    await page.evaluate(() => window.__dcsFrame());
    await page.waitForTimeout(4000);
    await page.evaluate(() => window.__dcsFrame());
    await page.waitForTimeout(3000);
    const pics = await page.evaluate(pair => {
      const c = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0];
      // Fit the whole canvas into the square (never crop), on the Studio's soft background.
      const o = document.createElement('canvas'); o.width = o.height = 640;
      const x = o.getContext('2d'); x.fillStyle = '#efe7e9'; x.fillRect(0, 0, 640, 640);
      const k = 640 / Math.max(c.width, c.height), w = c.width * k, h = c.height * k;
      x.drawImage(c, (640 - w) / 2, (640 - h) / 2, w, h);
      const out = {jpg: o.toDataURL('image/jpeg', .88), webp: o.toDataURL('image/webp', .84), size: [c.width, c.height, innerWidth, innerHeight]};
      // A second, closer picture for the home page's before-and-after: the cake fills the same share of the frame as the photo beside it.
      if (pair && window.__dcsBox) {
        const [x0, y0, x1, y1] = window.__dcsBox(), cw = c.width, ch = c.height;
        const s = Math.min(.84 / Math.max(.05, y1 - y0), .9 / Math.max(.05, x1 - x0) * (cw / ch));
        const side = ch / s, cx = (x0 + x1) / 2 * cw, cy = (y0 + y1) / 2 * ch;
        const p = document.createElement('canvas'); p.width = p.height = 640;
        const q = p.getContext('2d'); q.fillStyle = '#efe7e9'; q.fillRect(0, 0, 640, 640);
        q.drawImage(c, cx - side / 2, cy - side / 2, side, side, 0, 0, 640, 640);
        out.pairJpg = p.toDataURL('image/jpeg', .88); out.pairWebp = p.toDataURL('image/webp', .84);
      }
      return out;
    }, k.startsWith('sig_'));
    console.log(k, 'canvas', pics.size.join('x'), await page.evaluate(() => window.__dcsInfo ? window.__dcsInfo() : '')); delete pics.size;
    const NAMES = {jpg: `${k}.jpg`, webp: `${k}.webp`, pairJpg: `${k}-pair.jpg`, pairWebp: `${k}-pair.webp`};
    for (const [ext, d] of Object.entries(pics)) fs.writeFileSync(path.join(OUT, NAMES[ext]), Buffer.from(d.split(',')[1], 'base64'));
    manifest[k] = hash(themes.get(k));
    console.log('Rendered', k, errors.length ? `(page errors: ${errors.join(' | ').slice(0, 300)})` : '');
  } catch (e) { failed++; console.error('Could not render', k, e.message); }
  await page.close();
}
fs.writeFileSync(path.join(ROOT, '.rendered-cakes.json'), JSON.stringify(Object.fromEntries(todo.filter(k => manifest[k] === hash(themes.get(k))).map(k => [k, manifest[k]]))));
fs.writeFileSync(MANIFEST, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 1) + '\n');
await browser.close(); server.close();
if (failed) process.exitCode = 1;
