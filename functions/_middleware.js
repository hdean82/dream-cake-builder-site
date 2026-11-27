// Launch teaser: Orders and the customer pages stay private until launch.
// Visit /team?key=YOUR-KEY once on a device to unlock them there; /team?off locks that device again.
const KEY_SHA256 = '4b0d589486ef0aaa279ad2d18bbf62aa872c31d557dba3d7a3765acd35635544';
const LOCKED = /^\/(shop|request|portfolio|quote|calendar)(\.html)?\/?$/i;
const YEAR = 60 * 60 * 24 * 365;

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function cookie(req, name) {
  const m = (req.headers.get('Cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}
const go = (url, ...cookies) => {
  const h = new Headers({ Location: url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
  for (const c of cookies) if (c) h.append('Set-Cookie', c);
  return new Response(null, { status: 302, headers: h });
};
// the key cookie is HttpOnly so page scripts can never read it; dcb_team_ui only says "show the Orders links"
const keyCookie = key => `dcb_team=${encodeURIComponent(key)}; Path=/; Max-Age=${YEAR}; Secure; HttpOnly; SameSite=Lax`;
const uiCookie = `dcb_team_ui=1; Path=/; Max-Age=${YEAR}; Secure; SameSite=Lax`;

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/team' || path === '/team/') {
    if (url.searchParams.has('off')) return go('/', 'dcb_team=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax', 'dcb_team_ui=; Path=/; Max-Age=0; Secure; SameSite=Lax');
    const key = url.searchParams.get('key') || '';
    if (key && (await sha256(key)) === KEY_SHA256)
      return go('/shop', keyCookie(key), uiCookie);
    return go('/coming-soon');
  }

  if (LOCKED.test(path)) {
    const key = cookie(request, 'dcb_team');
    if (!key || (await sha256(key)) !== KEY_SHA256) return go('/coming-soon');
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'private, no-store');
    out.headers.set('X-Robots-Tag', 'noindex');
    // move devices unlocked before this change onto the HttpOnly cookie
    if (!/(?:^|; )dcb_team_ui=/.test(request.headers.get('Cookie') || '')) { out.headers.append('Set-Cookie', keyCookie(key)); out.headers.append('Set-Cookie', uiCookie); }
    return out;
  }
  return next();
}
