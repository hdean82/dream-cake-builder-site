// Keeps the home page in step with the Studio's theme cakes:
// - every cake picture gets ?v=<recipe hash>, so a re-rendered cake shows up right away instead of an old cached copy
// - names marked data-n="<theme key>" follow the theme's current name in studio.html
// Runs after the cake pictures are rendered (see .github/workflows/cake-pictures.yml), and after the home page is rebuilt.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const files = process.argv.slice(2).length ? process.argv.slice(2) : ['index.html'];
import crypto from 'node:crypto';
// Version each picture by its own bytes, so any new render (same recipe or not) reaches visitors at once.
const CAKES = path.join(ROOT, 'assets/home/cakes'), manifest = {};
for (const f of fs.readdirSync(CAKES)) if (f.endsWith('.jpg') && !f.endsWith('-pair.jpg')) manifest[f.slice(0, -4)] = crypto.createHash('sha1').update(fs.readFileSync(path.join(CAKES, f))).digest('hex').slice(0, 10);
const studio = fs.readFileSync(path.join(ROOT, 'studio.html'), 'utf8');
const names = {};
for (const m of studio.matchAll(/\{key:'([a-z0-9_]+)',name:'((?:[^'\\]|\\.)*)'/g)) if (!names[m[1]]) names[m[1]] = m[2].replace(/\\(.)/g, '$1');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// The home page gallery lists every signature theme in the Studio that has a picture, newest first,
// after the Blush Lambeth sample. New themes appear here on their own once their picture is rendered.
const sig = [...new Set([...studio.matchAll(/\{key:'(sig_[a-z0-9_]+)'/g)].map(m => m[1]))].reverse();
const pic = k => fs.existsSync(path.join(CAKES, k + '.jpg'));
const gallery = ['lambeth', ...sig].filter(pic);
const card = k => { const v = manifest[k] ? `?v=${manifest[k]}` : '', nm = esc(names[k] || 'Blush Lambeth');
  return `<a href="${k === 'lambeth' ? 'studio.html" data-open-cake' : 'studio.html?theme=' + k + '"'}><span class="im"><picture><source srcset="assets/home/cakes/${k}.webp${v}" type="image/webp"><img src="assets/home/cakes/${k}.jpg${v}" alt="${nm} cake" width="640" height="640" loading="lazy" data-fallback data-alt="${k}"></picture></span><b data-n="${k}">${nm}</b></a>`; };
for (const f of files) {
  const p = path.join(ROOT, f);
  let h = fs.readFileSync(p, 'utf8'); const before = h;
  h = h.replace(/(<section[^>]*id="gallery"[\s\S]*?<div class="row">)[\s\S]*?(<\/div>)/, (all, a, b) => a + gallery.map(card).join('') + b);
  h = h.replace(/(assets\/home\/cakes\/([a-z0-9_]+?)(-pair)?\.(?:jpg|webp))(\?v=[a-z0-9]+)?/g, (all, url, k) => manifest[k] ? `${url}?v=${manifest[k]}` : url);
  h = h.replace(/const CAKEV=\{[^}]*\};/, 'const CAKEV=' + JSON.stringify(manifest) + ';');
  h = h.replace(/(<(\w+)\b[^>]*\bdata-n="([a-z0-9_]+)"[^>]*>)([^<]*)(<\/\2>)/g, (all, open, tag, k, txt, close) => names[k] ? open + esc(names[k]) + close : all);
  h = h.replace(/(\bdata-alt="([a-z0-9_]+)"[^>]*?\balt=")([^"]*)(")/g, (all, a, k, txt, b) => names[k] ? a + esc(names[k]) + ' cake' + b : all);
  if (h !== before) { fs.writeFileSync(p, h); console.log('Updated', f); } else console.log('No changes', f);
}
