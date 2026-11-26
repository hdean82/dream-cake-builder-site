// Launch teaser: Orders and the customer pages stay private until launch.
// Visit /team?key=YOUR-KEY once on a device to unlock them there; /team?off locks that device again.
const KEY_SHA256 = '4b0d589486ef0aaa279ad2d18bbf62aa872c31d557dba3d7a3765acd35635544';
const LOCKED = /^\/(shop|request|portfolio|quote|calendar)(\.html)?\/?$/;
const YEAR = 60 * 60 * 24 * 365;

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function cookie(req, name) {
  const m = (req.headers.get('Cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}
const go = (url, setCookie) => {
  const h = new Headers({ Location: url, 'Cache-Control': 'no-store' });
  if (setCookie) h.append('Set-Cookie', setCookie);
  return new Response(null, { status: 302, headers: h });
};

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/team' || path === '/team/') {
    if (url.searchParams.has('off')) return go('/', 'dcb_team=; Path=/; Max-Age=0; Secure; SameSite=Lax');
    const key = url.searchParams.get('key') || '';
    if (key && (await sha256(key)) === KEY_SHA256)
      return go('/shop', `dcb_team=${encodeURIComponent(key)}; Path=/; Max-Age=${YEAR}; Secure; SameSite=Lax`);
    return go('/coming-soon');
  }

  if (LOCKED.test(path)) {
    const key = cookie(request, 'dcb_team');
    if (!key || (await sha256(key)) !== KEY_SHA256) return go('/coming-soon');
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'private, no-store');
    out.headers.set('X-Robots-Tag', 'noindex');
    return out;
  }
  return next();
}
