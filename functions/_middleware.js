// Launch teaser: Orders stays private until launch. Customer pages (request form, quotes and invoices, chat) are open.
// The team password lives only in Cloudflare (Pages > Settings > Variables and Secrets > TEAM_KEY), never in this code.
// Visit /team?key=YOUR-PASSWORD once on a device to unlock it; /team?off locks that device again.
// Devices keep a token derived from the password, so changing TEAM_KEY locks every device until it is unlocked again.
const LOCKED = /^\/(shop|calendar|beta-admin|pricing)(\.html)?\/?$/i;
const YEAR = 60 * 60 * 24 * 365;

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
const same = (a, b) => { if (!a || !b || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };
// trimmed because a password pasted into Cloudflare's box often brings a stray space or line break
const teamKey = env => String((env && env.TEAM_KEY) || '').trim();
const tokenFor = env => teamKey(env) ? sha256('dcb-team|' + teamKey(env)) : Promise.resolve('');
function cookie(req, name) {
  const m = (req.headers.get('Cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}
const go = (url, ...cookies) => {
  const h = new Headers({ Location: url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
  for (const c of cookies) if (c) h.append('Set-Cookie', c);
  return new Response(null, { status: 302, headers: h });
};
// the token cookie is HttpOnly so page scripts can never read it; dcb_team_ui only says "show the Orders links"
const keyCookie = tok => `dcb_team=${tok}; Path=/; Max-Age=${YEAR}; Secure; HttpOnly; SameSite=Lax`;
const uiCookie = `dcb_team_ui=1; Path=/; Max-Age=${YEAR}; Secure; SameSite=Lax`;
const FORM = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Team sign-in · Dream Cake Builder</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px system-ui,sans-serif;background:#fdf3f6;color:#3b1d2e}form{background:#fff;padding:28px;border-radius:18px;box-shadow:0 10px 30px #c2185b22;width:min(340px,88vw)}h1{font-size:20px;margin:0 0 14px}input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #e3c3d2;border-radius:10px;font-size:16px}button{margin-top:12px;width:100%;padding:12px;border:0;border-radius:10px;background:#c2185b;color:#fff;font-size:16px;font-weight:600}</style></head>
<body><form method="post" action="/team"><h1>Team sign-in</h1><input type="password" name="key" placeholder="Team password" autocomplete="current-password" autofocus required><button>Unlock this device</button></form></body></html>`;
const clear = ['dcb_team=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax', 'dcb_team_ui=; Path=/; Max-Age=0; Secure; SameSite=Lax'];

// Link previews: when an artist shares their order form (iMessage, Instagram, Facebook), show their shop name instead of ours.
const SB = 'https://gcorvodfcxhumesttwvj.supabase.co', SBKEY = 'sb_publishable_6ruYyVr__8c65Az5WCsiaA_jD9AcOgb';
async function shopPreview(slug, kind) {
  try {
    const r = await fetch(SB + '/rest/v1/rpc/shop_form_info', { method: 'POST', headers: { apikey: SBKEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_slug: slug }), signal: AbortSignal.timeout(2500), cf: { cacheTtl: 600, cacheEverything: true } });
    if (!r.ok) return null;
    const i = await r.json(); if (!i || typeof i.business !== 'string' || !i.business.trim()) return null;
    const f = i.form || {}, name = i.business.trim().slice(0, 80);
    const desc = String(f.intro || '').replace(/\s+/g, ' ').trim().slice(0, 180) || `Tell ${name} about your celebration and request a custom cake.`;
    const img = /^https:\/\//.test(f.logo || '') ? f.logo : '';
    if (kind === 'portfolio') return { title: `${name} · Cake gallery`, desc: `See cakes by ${name} and request your own.`, img };
    if (kind === 'review') return { title: `Leave a review for ${name}`, desc: `How was your cake? Share a few words with ${name}.`, img };
    return { title: `Order a cake from ${name}`, desc, img };
  } catch { return null; }
}
async function withPreview(res, p, url) {
  if (!p || !(res.headers.get('Content-Type') || '').includes('text/html')) return res;
  const set = (sel, v) => ({ element(e) { e.setAttribute('content', v); } });
  let rw = new HTMLRewriter()
    .on('title', { element(e) { e.setInnerContent(p.title); } })
    .on('meta[property="og:title"]', set(0, p.title)).on('meta[name="twitter:title"]', set(0, p.title))
    .on('meta[property="og:description"]', set(0, p.desc)).on('meta[name="description"]', set(0, p.desc))
    .on('meta[property="og:url"]', set(0, url));
  if (p.img) rw = rw.on('meta[property="og:image"]', set(0, p.img)).on('meta[name="twitter:image"]', set(0, p.img));
  const out = rw.transform(res);
  out.headers.set('Cache-Control', 'public, max-age=300');
  return out;
}

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Signed in with a site admin account: unlock this device without the team password.
  if (path === '/team/auth') {
    if (request.method !== 'POST') return new Response('Not found', { status: 404 });
    const body = await request.json().catch(() => ({}));
    const token = typeof body.token === 'string' ? body.token.slice(0, 4000) : '';
    let admin = false;
    if (token) {
      const r = await fetch('https://gcorvodfcxhumesttwvj.supabase.co/rest/v1/rpc/is_site_admin', {
        method: 'POST', headers: { apikey: 'sb_publishable_6ruYyVr__8c65Az5WCsiaA_jD9AcOgb', Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: '{}'
      }).catch(() => null);
      admin = !!(r && r.ok && (await r.json().catch(() => false)) === true);
    }
    const tok = await tokenFor(env);
    if (!admin || !tok) return new Response(JSON.stringify({ ok: false }), { status: 403, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
    const h = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    h.append('Set-Cookie', keyCookie(tok)); h.append('Set-Cookie', uiCookie);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: h });
  }
  if (path === '/team' || path === '/team/') {
    if (url.searchParams.has('off')) return go('/', ...clear);
    // setup check: says only whether a password is configured, never anything about it
    if (url.searchParams.has('check')) return new Response(teamKey(env) ? 'team password is set, ' + teamKey(env).length + ' characters' + (teamKey(env) !== String(env.TEAM_KEY) ? ' (extra spaces or line breaks were ignored)' : '') : 'team password is NOT set', { headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' } });
    let key = url.searchParams.get('key') || '';
    if (request.method === 'POST') { try { key = String((await request.formData()).get('key') || '').trim(); } catch { key = ''; } }
    else if (!key) return new Response(FORM, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
    const tok = await tokenFor(env);
    key = key.trim();
    if (key && teamKey(env) && same(await sha256('dcb-team|' + key), tok)) return go('/shop', keyCookie(tok), uiCookie);
    if (request.method === 'POST') {
      const msg = '<p style="color:#b00020;margin:0 0 12px">That password did not match. You typed ' + key.length + ' characters; the saved one has ' + teamKey(env).length + '.</p>';
      return new Response(FORM.replace('</h1>', '</h1>' + msg), { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
    }
    return go('/coming-soon');
  }

  if (LOCKED.test(path)) {
    const tok = await tokenFor(env);
    if (!same(cookie(request, 'dcb_team'), tok)) return go('/coming-soon', ...clear);
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'private, no-store');
    out.headers.set('X-Robots-Tag', 'noindex');
    return out;
  }
  const pv = path.match(/^\/(request|review|portfolio)(\.html)?\/?$/i);
  if (pv && request.method === 'GET') {
    const slug = (url.searchParams.get('shop') || '').trim().toLowerCase();
    if (/^[a-z0-9-]{2,60}$/.test(slug)) {
      const [res, p] = await Promise.all([next(), shopPreview(slug, pv[1].toLowerCase())]);
      return withPreview(res, p, url.href);
    }
  }
  return next();
}
