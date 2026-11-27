// Screenshots of the real Studio with the Blush Lambeth, for the home page (desktop and phone).
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'assets/home');
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const code0 = (home.match(/const LAMBETH='(DCS1:[^']+)'/) || home.match(/'dcs-open-code','(DCS1:[^']+)'/))[1];
const d = JSON.parse(Buffer.from(code0.slice(5), 'base64').toString('utf8'));
d.scene = { ...(d.scene || {}), table: false }; // no turntable under the cake
const code = 'DCS1:' + Buffer.from(JSON.stringify(d), 'utf8').toString('base64');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.glb': 'model/gltf-binary' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  let f = path.join(ROOT, p); if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404).end(); return; } res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); res.end(b); });
}).listen(8768);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [name, vp, scale] of [['studio-hero-desktop', { width: 1440, height: 900 }, 1], ['studio-hero-phone', { width: 390, height: 844 }, 2.5]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: scale, isMobile: scale > 1, hasTouch: scale > 1 });
  await ctx.addCookies([{ name: 'dcs_tour', value: '1', domain: 'localhost', path: '/' }, { name: 'dcb_team_ui', value: '1', domain: 'localhost', path: '/' }]);
  const page = await ctx.newPage();
  await page.addInitScript(c => { try { localStorage.setItem('dcs-open-code', c); } catch (e) {} }, code);
  await page.goto('http://localhost:8768/studio.html', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(40000);
  await page.evaluate(() => { document.querySelectorAll('#toast,.toast,.tour,.coach,#wlCard').forEach(e => e.remove()); });
  await page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 90 });
  console.log('Saved', name);
  await ctx.close();
}
await browser.close(); server.close();
