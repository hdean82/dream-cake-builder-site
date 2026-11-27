// Renders every cake picture the promo needs, straight from the Studio, with a transparent background.
// Usage: node tools/promo/render3d.mjs <outDir> [--quick]
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { STAGES, shotList, frameName } from './plan.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const OUT = path.resolve(process.argv[2] || 'promo-frames');
const QUICK = process.argv.includes('--quick');
fs.mkdirSync(OUT, { recursive: true });

// The Blush Lambeth design from the home page, and the stages that lead up to it.
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const code0 = home.match(/const LAMBETH='(DCS1:[^']+)'/)[1];
const final = JSON.parse(Buffer.from(code0.slice(5), 'base64').toString('utf8'));
const plainTier = t => ({ ...t, color: '#fbf7f1', top: 'none', bottom: 'none', side: 'none', bows: false });
const designs = {
  tiers: { ...final, topper: 'none', boardColor: '#fbf7f1', tiers: final.tiers.map(plainTier) },
  colors: { ...final, topper: 'none', tiers: final.tiers.map((t, i) => ({ ...plainTier(t), color: t.color })) },
  borders: { ...final, topper: 'none', tiers: final.tiers.map(t => ({ ...t, side: 'none', bows: false })) },
  swags: { ...final, topper: 'none', tiers: final.tiers.map(t => ({ ...t, bows: false })) },
  bows: { ...final, topper: 'none' },
  final,
};
const encode = d => 'DCS1:' + Buffer.from(JSON.stringify(d), 'utf8').toString('base64');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.glb': 'model/gltf-binary' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  let f = path.join(ROOT, p); if (!f.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404).end(); return; } res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); res.end(b); });
}).listen(8766);

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1 });
const shots = shotList();
let cam = null;
const order = ['final', ...STAGES.map(s => s.key).filter(k => k !== 'final')];
for (const key of order) {
  let angles = shots[key] || [];
  if (QUICK) angles = angles.filter((a, i) => i % 25 === 0 || a === 0);
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('page error', key, String(e).slice(0, 200)));
  await page.addInitScript(c => { try { localStorage.setItem('dcs-open-code', c); } catch (e) {} }, encode(designs[key]));
  await page.goto('http://localhost:8766/studio.html?view=1&shot=1', { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => typeof window.__dcsTurn === 'function' && !document.getElementById('loading'), null, { timeout: 120000 });
  await page.waitForTimeout(18000); // the cake's 3D pieces arrive and the viewer stops re-fitting
  if (!cam) { await page.evaluate(() => window.__dcsFrame()); await page.waitForTimeout(1500); cam = await page.evaluate(() => window.__dcsCam()); const d = cam.cam.map((v, i) => v - cam.tgt[i]); cam.tgt[1] += 0.6; cam.cam = cam.tgt.map((v, i) => v + d[i] * 0.84); }
  await page.evaluate(v => window.__dcsCam(v), cam);
  await page.waitForTimeout(800);
  let n = 0;
  for (const a of angles) {
    const data = await page.evaluate(deg => {
      window.__dcsTurn(deg);
      const c = [...document.querySelectorAll('canvas')].sort((x, y) => y.width * y.height - x.width * x.height)[0];
      return c.toDataURL('image/webp', 0.9);
    }, a);
    fs.writeFileSync(path.join(OUT, frameName(key, a)), Buffer.from(data.split(',')[1], 'base64'));
    if (++n % 50 === 0) console.log(key, n, '/', angles.length);
  }
  console.log('Rendered', key, angles.length, 'pictures');
  await page.close();
}
await browser.close(); server.close();
