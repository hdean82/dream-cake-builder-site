/* Dream Cake Builder — shared site script: menu, image fallback, waitlist form */
{
  // team devices (unlocked at /team?key=…) also see the Orders links
  if (/(?:^|; )dcb_team(?:_ui)?=/.test(document.cookie)) document.documentElement.classList.add('team');

  // close the phone menu after choosing a link or tapping outside
  // (works for the site menu and the Studio's logo menu)
  document.querySelectorAll('details.menu, details.dcb-sitemenu').forEach(menu => {
    menu.addEventListener('click', e => { if (e.target.closest('a')) menu.open = false; });
    document.addEventListener('click', e => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') menu.open = false; });
  });

  // smooth page changes: modern browsers use CSS view transitions (see dcb-theme.css);
  // older ones get a short fade out / fade in here instead
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('onpagereveal' in window) && !calm) {
    const root = document.documentElement;
    root.classList.add('dcb-fade');
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
      e.preventDefault();
      root.classList.add('dcb-leaving');
      setTimeout(() => { location.href = u.href; }, 170);
    });
    addEventListener('pageshow', e => { if (e.persisted) root.classList.remove('dcb-leaving'); });
  }

  // inside the Orders app (shop.html#orders → #calendar …) sections switch with the same soft fade
  if (document.startViewTransition && !calm) {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href*="#"]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname !== location.pathname || u.search !== location.search) return;
      const id = decodeURIComponent(u.hash.slice(1));
      if (!id || u.hash === location.hash || document.getElementById(id)) return; // real in-page anchors just scroll
      e.preventDefault();
      document.startViewTransition(() => new Promise(done => {
        addEventListener('hashchange', () => requestAnimationFrame(done), { once: true });
        setTimeout(done, 400);
        location.hash = u.hash;
      }));
    });
  }

  // load the next page early when someone points at a link, so it opens instantly
  if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules') && !document.querySelector('script[type=speculationrules]')) {
    const light = ['/', '/index.html', '/contact.html', '/privacy.html'];
    const rules = document.createElement('script');
    rules.type = 'speculationrules';
    rules.textContent = JSON.stringify({
      prerender: [{ where: { or: light.map(h => ({ href_matches: h })) }, eagerness: 'moderate' }],
      prefetch: [{ where: { and: [{ href_matches: '/*' }, { not: { or: light.map(h => ({ href_matches: h })) } }] }, eagerness: 'moderate' }]
    });
    document.head.append(rules);
  }

  // soft placeholder if a picture can't load
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    const fail = () => { img.classList.add('ph'); img.alt = ''; img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Cdefs%3E%3ClinearGradient id='g' x2='1' y2='1'%3E%3Cstop stop-color='%23fde3f0'/%3E%3Cstop offset='.55' stop-color='%23efe4fb'/%3E%3Cstop offset='1' stop-color='%23dff3f1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='4' height='3' fill='url(%23g)'/%3E%3C/svg%3E"; };
    if (img.complete && !img.naturalWidth) fail(); else img.addEventListener('error', fail, { once: true });
  });

  // header: "Sign in" becomes "Account" when signed in on this device
  const acct = () => {
    let on = false;
    try { const t = JSON.parse(localStorage.getItem('sb-gcorvodfcxhumesttwvj-auth-token')); on = !!(t && t.access_token && (!t.expires_at || t.expires_at * 1000 > Date.now() - 864e5 * 30)); } catch {}
    document.querySelectorAll('[data-acct]').forEach(a => { a.textContent = on ? 'Account' : 'Sign in'; });
  };
  acct(); window.addEventListener('dcb-auth', acct); window.addEventListener('storage', acct);

  // footer year
  document.querySelectorAll('[data-year]').forEach(n => { n.textContent = new Date().getFullYear(); });

  // waitlist forms (any form[data-launch], plus the original #launchForm) save to Supabase launch_subscribers
  const SUPABASE_URL = 'https://gcorvodfcxhumesttwvj.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_6ruYyVr__8c65Az5WCsiaA_jD9AcOgb';
  const LIVE = ['dreamcakebuilder.com', 'www.dreamcakebuilder.com', 'dream-cake-builder-site.pages.dev'];
  document.querySelectorAll('form[data-launch], #launchForm').forEach(form => {
    const status = form.querySelector('[data-launch-status]') || document.getElementById('launchStatus');
    let busy = false;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (busy || !form.reportValidity()) return;
      if (form.elements.website && form.elements.website.value) return;   // spam trap
      busy = true;
      const btn = form.querySelector('button');
      btn.disabled = true; status.textContent = 'Joining the list…';
      try {
        if (!LIVE.includes(location.hostname)) { await new Promise(r => setTimeout(r, 500)); status.textContent = 'Preview only: on the live site this adds you to the list.'; return; }
        const res = await fetch(SUPABASE_URL + '/rest/v1/launch_subscribers', {
          method: 'POST',
          headers: { apikey: PUBLISHABLE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ email: form.elements.email.value.trim().toLowerCase(), news_updates: !!(form.elements.news && form.elements.news.checked) }),
          signal: AbortSignal.timeout(15000)
        });
        if (!res.ok) { const err = await res.json().catch(() => ({})); if (err.code !== '23505') throw new Error('save failed'); }
        status.textContent = 'You’re on the list! Watch your inbox for launch news.';
        form.classList.add('joined');
        form.reset();
      } catch {
        status.textContent = 'We couldn’t save your email. Please try again in a moment.';
      } finally { busy = false; btn.disabled = false; }
    });
  });
}

// Beta testers: a "Report a problem" button on every page, once their invite link has been opened on this device.
(() => {
  const FN = 'https://gcorvodfcxhumesttwvj.supabase.co/functions/v1/beta';
  const code = () => { try { return localStorage.getItem('dcb-beta-code') || ''; } catch (e) { return ''; } };
  let built = false;
  function build() {
    if (built || !code() || document.documentElement.classList.contains('viewer') || window.top !== window) return;
    built = true;
    const st = document.createElement('style');
    st.textContent = `.dcb-bug{position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:9990;display:flex;align-items:center;gap:6px;border:1px solid #eed3e3;background:#fff;color:#9a1b5f;border-radius:999px;padding:8px 13px;font:600 13px/1 Inter,system-ui,sans-serif;box-shadow:0 8px 22px -10px #4b103d77;cursor:pointer}
.dcb-bug:hover{border-color:#c12c7e}
.dcb-bugd{position:fixed;inset:0;z-index:9991;background:#2b142466;display:flex;align-items:flex-end;justify-content:center;padding:12px}
@media(min-width:640px){.dcb-bugd{align-items:center}}
.dcb-bugd form{background:#fff;color:#4b103d;width:min(460px,100%);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:12px;font:15px/1.45 Inter,system-ui,sans-serif;max-height:calc(100vh - 24px);overflow:auto}
.dcb-bugd h2{font:600 22px Fraunces,Georgia,serif;margin:0}
.dcb-bugd p{margin:0;color:#79536e;font-size:13.5px}
.dcb-bugd .k{display:flex;gap:6px}.dcb-bugd .k label{flex:1}
.dcb-bugd .k input{position:absolute;opacity:0;pointer-events:none}
.dcb-bugd .k span{display:block;text-align:center;border:1px solid #eed3e3;border-radius:10px;padding:9px 6px;font-weight:600;font-size:13.5px;cursor:pointer}
.dcb-bugd .k input:checked+span{background:#4b103d;color:#fff;border-color:#4b103d}
.dcb-bugd .k input:focus-visible+span{outline:2px solid #c12c7e;outline-offset:2px}
.dcb-bugd label.f{display:flex;flex-direction:column;gap:5px;font-weight:600;font-size:13.5px}
.dcb-bugd textarea{font:inherit;font-weight:400;font-size:16px;padding:10px 12px;border:1px solid #e3c3d4;border-radius:10px;resize:vertical;min-height:90px}
.dcb-bugd .r{display:flex;gap:8px;justify-content:flex-end;align-items:center;flex-wrap:wrap}
.dcb-bugd button{font:600 14.5px Inter,system-ui,sans-serif;border-radius:10px;padding:11px 16px;cursor:pointer;border:1px solid #eed3e3;background:#fff;color:#4b103d}
.dcb-bugd button.p{background:#c12c7e;border-color:#c12c7e;color:#fff}
.dcb-bugd .s{font-size:13.5px;margin-right:auto}.dcb-bugd .s.bad{color:#b3261e}.dcb-bugd .s.good{color:#22703c}
@media print{.dcb-bug,.dcb-bugd{display:none}}`;
    document.head.appendChild(st);
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'dcb-bug'; b.setAttribute('aria-haspopup', 'dialog');
    b.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg>Report a problem';
    document.body.appendChild(b);
    b.addEventListener('click', open);
  }
  function open() {
    const d = document.createElement('div');
    d.className = 'dcb-bugd';
    d.innerHTML = `<form role="dialog" aria-modal="true" aria-labelledby="dcbBugT" novalidate>
<h2 id="dcbBugT">Tell us what happened</h2><p>We'll see which page you're on and what device you're using, so you don't need to explain that.</p>
<div class="k" role="radiogroup" aria-label="What is it?"><label><input type="radio" name="kind" value="bug" checked><span>Something's wrong</span></label><label><input type="radio" name="kind" value="idea"><span>An idea</span></label><label><input type="radio" name="kind" value="question"><span>A question</span></label></div>
<label class="f">What happened?<textarea name="what" maxlength="4000" required placeholder="What were you trying to do, and what did you see?"></textarea></label>
<label class="f">What did you expect? <span style="font-weight:400;color:#79536e">(optional)</span><textarea name="expected" maxlength="2000" style="min-height:60px"></textarea></label>
<div class="r"><p class="s" role="status" aria-live="polite"></p><button type="button" data-x>Cancel</button><button type="submit" class="p">Send report</button></div></form>`;
    document.body.appendChild(d);
    const f = d.querySelector('form'), s = d.querySelector('.s'), send = f.querySelector('.p');
    const close = () => { d.remove(); document.removeEventListener('keydown', key); document.querySelector('.dcb-bug')?.focus(); };
    const key = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-x]')) close(); });
    f.what.focus();
    f.addEventListener('submit', async e => {
      e.preventDefault();
      if (f.what.value.trim().length < 5) { s.textContent = 'Tell us a little more about what happened.'; s.className = 's bad'; f.what.focus(); return; }
      send.disabled = true; s.textContent = 'Sending…'; s.className = 's';
      const page = (document.title || '') + ' · ' + location.pathname + location.hash;
      const device = `${navigator.userAgent} · screen ${screen.width}x${screen.height} · window ${innerWidth}x${innerHeight}`;
      try {
        const r = await fetch(FN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'report', code: code(), kind: f.kind.value, what: f.what.value, expected: f.expected.value, page, device }) });
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.ok) { s.textContent = 'Thank you! Report #' + j.id + ' is on its way.'; s.className = 's good'; f.what.value = ''; f.expected.value = ''; setTimeout(close, 1800); }
        else { s.textContent = j.error || 'Your report couldn’t be sent. Please email support@dreamcakebuilder.com.'; s.className = 's bad'; }
      } catch (err) { s.textContent = 'Your report couldn’t be sent. Check your connection and try again.'; s.className = 's bad'; }
      send.disabled = false;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  window.addEventListener('dcb-beta', build);
})();

// Signed in with the owner account: this device unlocks the private pages automatically (no team password needed).
(() => {
  if (/(?:^|; )dcb_team_ui=/.test(document.cookie)) return;
  try { if (sessionStorage.getItem('dcb-team-tried')) return; } catch (e) {}
  const token = async () => {
    try { if (window.DCBAuth) { const s = await window.DCBAuth.session(); if (s && s.access_token) return s.access_token; } } catch (e) {}
    try { const s = JSON.parse(localStorage.getItem('sb-gcorvodfcxhumesttwvj-auth-token')); if (s && s.access_token && (!s.expires_at || s.expires_at > Date.now() / 1000 + 30)) return s.access_token; } catch (e) {}
    return '';
  };
  const run = async () => {
    const t = await token(); if (!t) return;
    try { sessionStorage.setItem('dcb-team-tried', '1'); } catch (e) {}
    const r = await fetch('/team/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: t }) }).catch(() => null);
    if (!r || !r.ok) return;
    document.documentElement.classList.add('team');
    if (/coming-soon/.test(location.pathname)) location.replace('/shop');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('dcb-auth', () => { try { sessionStorage.removeItem('dcb-team-tried'); } catch (e) {} run(); });
})();
