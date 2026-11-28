/* Dream Cake Builder — small sign-in helper for Supabase Auth.
   Talks to Supabase's sign-in service directly (no library to load) and keeps the
   session under the same browser key the Supabase JS library uses, so a sign-in
   here is shared with the Studio on the same site, and the other way round. */
(function () {
  const URL_ = 'https://gcorvodfcxhumesttwvj.supabase.co';
  const KEY = 'sb_publishable_6ruYyVr__8c65Az5WCsiaA_jD9AcOgb';
  const STORE = 'sb-gcorvodfcxhumesttwvj-auth-token';
  const now = () => Math.floor(Date.now() / 1000);

  const read = () => { try { return JSON.parse(localStorage.getItem(STORE)) || null; } catch { return null; } };
  const write = s => {
    try {
      if (!s) { localStorage.removeItem(STORE); }
      else {
        const expires_at = s.expires_at || (now() + (+s.expires_in || 3600));
        localStorage.setItem(STORE, JSON.stringify({ ...s, expires_at }));
      }
    } catch { /* storage unavailable: session lasts for this page only */ }
    window.dispatchEvent(new Event('dcb-auth'));
  };

  async function call(path, { method = 'POST', body, token } = {}) {
    const res = await fetch(URL_ + '/auth/v1/' + path, {
      method,
      headers: { apikey: KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const raw = (data.error_description || data.msg || data.message || '').toLowerCase();
      let msg = 'Something went wrong. Please try again.';
      if (raw.includes('invalid login') || raw.includes('invalid_grant') || raw.includes('invalid credentials')) msg = 'That email and password don’t match.';
      else if (raw.includes('not confirmed')) msg = 'Please confirm your email first. Check your inbox for the link.';
      else if (raw.includes('rate') || res.status === 429) msg = 'Too many tries. Please wait a minute and try again.';
      else if (raw.includes('signups not allowed') || raw.includes('user not found')) msg = 'We couldn’t find an account for that email.';
      else if (raw.includes('password')) msg = data.msg || data.message || msg;
      const e = new Error(msg); e.status = res.status; throw e;
    }
    return data;
  }

  let refreshing = null;
  async function session() {
    const s = read();
    if (!s || !s.access_token) return null;
    if ((s.expires_at || 0) - now() > 60) return s;
    if (!s.refresh_token) { write(null); return null; }
    refreshing = refreshing || call('token?grant_type=refresh_token', { body: { refresh_token: s.refresh_token } })
      .then(d => { write(d); return read(); })
      .catch(() => { write(null); return null; })
      .finally(() => { refreshing = null; });
    return refreshing;
  }

  async function signInWithPassword(email, password) {
    const d = await call('token?grant_type=password', { body: { email, password } });
    write(d); return read();
  }
  const sendLink = (email, redirect) => call('otp?redirect_to=' + encodeURIComponent(redirect), { body: { email, create_user: false } });
  const sendReset = (email, redirect) => call('recover?redirect_to=' + encodeURIComponent(redirect), { body: { email } });
  async function updatePassword(password) {
    const s = await session(); if (!s) throw new Error('Please sign in again.');
    await call('user', { method: 'PUT', body: { password }, token: s.access_token });
  }
  // The signed-in person's account (name, email, phone kept with the sign-in).
  async function getUser() {
    const s = await session(); if (!s) throw new Error('Please sign in again.');
    const u = await call('user', { method: 'GET', token: s.access_token }); write({ ...read(), user: u }); return u;
  }
  async function updateUser(body, redirect) {
    const s = await session(); if (!s) throw new Error('Please sign in again.');
    const u = await call('user' + (redirect ? '?redirect_to=' + encodeURIComponent(redirect) : ''), { method: 'PUT', body, token: s.access_token });
    write({ ...read(), user: u }); return u;
  }
  async function signOut() {
    const s = read();
    write(null);
    if (s && s.access_token) { try { await call('logout', { token: s.access_token }); } catch { /* already signed out */ } }
  }
  // After clicking an email link, Supabase returns here with the session in the address.
  async function fromRedirect() {
    const h = new URLSearchParams(location.hash.slice(1));
    if (h.get('error_description')) { history.replaceState(null, '', location.pathname + location.search); throw new Error(h.get('error_description').replace(/\+/g, ' ')); }
    const access_token = h.get('access_token');
    if (!access_token) return null;
    const s = { access_token, refresh_token: h.get('refresh_token'), expires_in: +h.get('expires_in') || 3600, token_type: 'bearer' };
    try { s.user = await call('user', { method: 'GET', token: access_token }); } catch { /* keep going */ }
    write(s);
    history.replaceState(null, '', location.pathname + location.search);
    return h.get('type') || 'signin';
  }
  // Call a database function as the signed-in person.
  async function rpc(fn, body = {}) {
    const s = await session();
    const res = await fetch(URL_ + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json', Authorization: 'Bearer ' + (s ? s.access_token : KEY) },
      body: JSON.stringify(body), signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) throw new Error('request failed');
    return res.json();
  }

  window.DCBAuth = { session, signInWithPassword, sendLink, sendReset, updatePassword, getUser, updateUser, signOut, fromRedirect, rpc, current: read };
})();
