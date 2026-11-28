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

  // open pages faster (Safari and Firefox): start fetching a page (and, for the Studio, its 3D engine everywhere) as soon as
  // someone hovers over or touches a link to it, so the click lands on a page that is mostly loaded
  {
    const warm = new Set(), slow = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
    const fetchEarly = (href, cors) => { if (warm.has(href)) return; warm.add(href); const l = document.createElement('link'); l.rel = 'prefetch'; l.href = href; if (cors) l.crossOrigin = 'anonymous'; document.head.appendChild(l); };
    const onIntent = e => {
      const a = e.target.closest && e.target.closest('a[href]'); if (!a || slow) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname === location.pathname || !/(\/|\.html|\/[a-z-]+)$/i.test(u.pathname)) return;
      if (!(HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules'))) fetchEarly(u.pathname + u.search); // Chrome already does this via speculation rules below
      if (/^\/studio(\.html)?$/i.test(u.pathname)) fetchEarly('https://unpkg.com/three@0.163.0/build/three.module.js', true);
    };
    document.addEventListener('pointerover', onIntent, { passive: true });
    document.addEventListener('touchstart', onIntent, { passive: true });
  }

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

// Beta testers: a "Report a problem" button on every page, a report form that searches what's already been reported,
// and a light activity trail (pages visited) so the team can see what testers tried. Shared with the Beta board via window.DCBBeta.
(() => {
  const FN = 'https://gcorvodfcxhumesttwvj.supabase.co/functions/v1/beta';
  const AREAS = ['Studio', 'Orders', 'Calendar', 'Client review link', 'Home page', 'Account and sign-in', 'Emails', 'Something else'];
  const STOP = new Set('the a an and or but to of in on at for with is it its this that was were be are i my me we you when what how why can cant cannot dont doesnt not no from as by up out so just get got have has had do does did after before then than there their into onto would should could will about'.split(' '));
  const code = () => { try { return localStorage.getItem('dcb-beta-code') || ''; } catch (e) { return ''; } };
  const authToken = async () => { try { if (window.DCBAuth) { const s = await window.DCBAuth.session(); if (s && s.access_token) return s.access_token; } } catch (e) {} try { const s = JSON.parse(localStorage.getItem('sb-gcorvodfcxhumesttwvj-auth-token')); if (s && s.access_token && (!s.expires_at || s.expires_at > Date.now() / 1000 + 30)) return s.access_token; } catch (e) {} return ''; };
  async function call(action, body) {
    const h = { 'Content-Type': 'application/json' }, c = code();
    if (!c) { const t = await authToken(); if (t) h.Authorization = 'Bearer ' + t; }
    const r = await fetch(FN, { method: 'POST', headers: h, body: JSON.stringify({ action, code: c, ...(body || {}) }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) throw Object.assign(new Error(j.error || 'Something went wrong. Please try again.'), { status: r.status });
    return j;
  }
  const words = t => (t || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP.has(w)).map(w => w.replace(/(ing|ed|es|s)$/, ''));
  function similar(text, reports, n) {
    const q = [...new Set(words(text))]; if (!q.length) return [];
    return reports.map(r => { const w = new Set(words(r.title + ' ' + r.what + ' ' + r.area)); let hit = 0; q.forEach(x => { if (w.has(x)) hit++; else if ([...w].some(y => y.length > 3 && (y.startsWith(x) || x.startsWith(y)))) hit += .6; }); return { r, score: hit / q.length }; })
      .filter(x => x.score >= .34).sort((a, b) => b.score - a.score).slice(0, n || 4).map(x => x.r);
  }
  const STEPS = [['sent', 'Sent'], ['reviewing', 'Reviewing'], ['in_progress', 'In progress'], ['completed', 'Completed']];
  const heart = (sz = 18) => `<svg class="dcb-heart" width="${sz}" height="${sz}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z" fill="#f472b6"/><path d="M8.2 12.4l2.6 2.6 5-5.2" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const statusLabel = s => s === 'wontfix' ? 'Not planned' : (STEPS.find(x => x[0] === s) || STEPS[0])[1];
  const guessArea = () => { const p = location.pathname; if (/studio/.test(p)) return 'Studio'; if (/shop/.test(p)) return /calendar/.test(location.hash) ? 'Calendar' : 'Orders'; if (/view|review|share/.test(p)) return 'Client review link'; if (/account/.test(p)) return 'Account and sign-in'; if (p === '/' || /index/.test(p)) return 'Home page'; return ''; };
  let reportsCache = null, built = false, isTester = null;
  async function tester() {
    if (isTester !== null) return isTester;
    if (code()) return (isTester = true);
    try { const v = sessionStorage.getItem('dcb-beta-auth'); if (v) return (isTester = v === '1'); } catch (e) {}
    if (!(await authToken())) return (isTester = false);
    try { await call('check'); isTester = true; } catch (e) { isTester = false; }
    try { sessionStorage.setItem('dcb-beta-auth', isTester ? '1' : '0'); } catch (e) {}
    return isTester;
  }
  const CSS = `.dcb-bug{position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:9990;display:flex;align-items:center;gap:6px;border:1px solid #eed3e3;background:#fff;color:#9a1b5f;border-radius:999px;padding:8px 13px;font:600 13px/1 Inter,system-ui,sans-serif;box-shadow:0 8px 22px -10px #4b103d77;cursor:pointer}
.dcb-bug:hover{border-color:#c12c7e}
.dcb-bugd{position:fixed;inset:0;z-index:9991;background:#2b142466;display:flex;align-items:flex-end;justify-content:center;padding:12px}
@media(min-width:640px){.dcb-bugd{align-items:center}}
.dcb-bugd form{background:#fff;color:#4b103d;width:min(520px,100%);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:13px;font:15px/1.45 Inter,system-ui,sans-serif;max-height:calc(100vh - 24px);overflow:auto}
.dcb-bugd h2{font:600 22px Fraunces,Georgia,serif;margin:0}
.dcb-bugd p{margin:0;color:#79536e;font-size:13.5px}
.dcb-bugd .k{display:flex;gap:6px}.dcb-bugd .k label{flex:1;position:relative}
.dcb-bugd .k input{position:absolute;opacity:0;pointer-events:none}
.dcb-bugd .k span{display:block;text-align:center;border:1px solid #eed3e3;border-radius:10px;padding:9px 6px;font-weight:600;font-size:13.5px;cursor:pointer}
.dcb-bugd .k input:checked+span{background:#4b103d;color:#fff;border-color:#4b103d}
.dcb-bugd .k input:focus-visible+span{outline:2px solid #c12c7e;outline-offset:2px}
.dcb-bugd label.f{display:flex;flex-direction:column;gap:5px;font-weight:600;font-size:13.5px}
.dcb-bugd textarea,.dcb-bugd input[type=text],.dcb-bugd select{font:inherit;font-weight:400;font-size:16px;padding:10px 12px;border:1px solid #e3c3d4;border-radius:10px;background:#fff;color:#4b103d}
.dcb-bugd textarea{resize:vertical;min-height:84px}
.dcb-bugd .dup{border:1px dashed #f0b6d2;background:#fff7fb;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px}
.dcb-bugd .dup b{font-size:13.5px}
.dcb-bugd .dupi{display:flex;gap:10px;align-items:center;background:#fff;border:1px solid #f3d6e5;border-radius:10px;padding:9px 10px;font-size:13.5px}
.dcb-bugd .dupi .t{flex:1;min-width:0}.dcb-bugd .dupi .t small{display:block;color:#8a6a80;font-size:12px;margin-top:2px}
.dcb-bugd .dupi button{padding:7px 11px;font-size:13px;white-space:nowrap}
.dcb-bugd .dupi button.on{background:#4b103d;color:#fff;border-color:#4b103d}
.dcb-bugd .r{display:flex;gap:8px;justify-content:flex-end;align-items:center;flex-wrap:wrap}
.dcb-bugd button{font:600 14.5px Inter,system-ui,sans-serif;border-radius:10px;padding:11px 16px;cursor:pointer;border:1px solid #eed3e3;background:#fff;color:#4b103d}
.dcb-bugd button.p{background:#c12c7e;border-color:#c12c7e;color:#fff}
.dcb-bugd .s{font-size:13.5px;margin-right:auto}.dcb-bugd .s.bad{color:#b3261e}.dcb-bugd .s.good{color:#22703c}
.dcb-bugd .err{outline:2px solid #e3a1a1;outline-offset:1px}
.dcb-bugd a{color:#9a1b5f}
@media print{.dcb-bug,.dcb-bugd{display:none}}`;
  async function build() {
    if (built || document.documentElement.classList.contains('viewer') || window.top !== window) return;
    if (!(await tester())) return;
    built = true;
    const CSS2 = '.dcb-bug{opacity:.92}@media(max-width:820px){.dcb-bug span{display:none}.dcb-bug{padding:9px!important;border-radius:999px!important}}body{padding-bottom:max(var(--dcb-pb,0px),56px)}';
    { const s2 = document.createElement('style'); s2.textContent = CSS2; document.head.appendChild(s2); }
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    if (!document.body.dataset.betaBoard) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'dcb-bug'; b.setAttribute('aria-haspopup', 'dialog');
      b.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg><span>Report a problem</span>'; b.setAttribute('aria-label', 'Report a problem');
      document.body.appendChild(b);
      b.addEventListener('click', () => open());
    }
    // activity trail: one note per page per visit
    try { const k = 'dcb-beta-seen:' + location.pathname; if (!sessionStorage.getItem(k)) { sessionStorage.setItem(k, '1'); call('track', { page: (document.title.split(' · ')[0] || '') + ' (' + location.pathname + ')' }).catch(() => {}); } } catch (e) {}
    window.dispatchEvent(new Event('dcb-beta-ready'));
  }
  async function reports(fresh) { if (!reportsCache || fresh) reportsCache = call('board').then(j => j.reports).catch(e => { reportsCache = null; throw e; }); return reportsCache; }
  function open(pre) {
    pre = pre || {};
    const d = document.createElement('div');
    d.className = 'dcb-bugd';
    const area = pre.area || guessArea();
    d.innerHTML = `<form role="dialog" aria-modal="true" aria-labelledby="dcbBugT" novalidate>
<h2 id="dcbBugT">Tell us what happened</h2><p>We'll note which page you're on and your device, so you don't need to explain that. Every box is needed so we can fix it fast.</p>
<div class="k" role="radiogroup" aria-label="What is it?"><label><input type="radio" name="kind" value="bug" checked><span>Something's wrong</span></label><label><input type="radio" name="kind" value="idea"><span>An idea</span></label><label><input type="radio" name="kind" value="question"><span>A question</span></label></div>
<label class="f">Short title<input type="text" name="title" maxlength="140" required placeholder="e.g. Sequins don't show on the top tier" autocomplete="off" value="${esc(pre.title || '')}"></label>
<div class="dup" hidden aria-live="polite"></div>
<label class="f">Where did it happen?<select name="area" required><option value="">Choose one</option>${AREAS.map(a => `<option${a === area ? ' selected' : ''}>${a}</option>`).join('')}</select></label>
<label class="f"><span data-w>What happened?</span><textarea name="what" maxlength="4000" required placeholder="What were you trying to do, and what did you see?"></textarea></label>
<label class="f"><span data-e>What did you expect to happen?</span><textarea name="expected" maxlength="2000" required style="min-height:64px"></textarea></label>
<div class="r"><p class="s" role="status" aria-live="polite"></p><button type="button" data-x>Cancel</button><button type="submit" class="p">Send report</button></div></form>`;
    document.body.appendChild(d);
    const f = d.querySelector('form'), s = d.querySelector('.s'), send = f.querySelector('.p'), dup = d.querySelector('.dup');
    const close = () => { d.remove(); document.removeEventListener('keydown', key); (document.querySelector('.dcb-bug') || document.querySelector('[data-report]'))?.focus(); };
    const key = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-x]')) close(); });
    const relabel = () => { const k = f.kind.value; d.querySelector('[data-w]').textContent = k === 'bug' ? 'What happened?' : k === 'idea' ? "What's your idea?" : "What's your question?"; d.querySelector('[data-e]').textContent = k === 'bug' ? 'What did you expect to happen?' : k === 'idea' ? 'How would it help you?' : 'What are you trying to do?'; };
    f.addEventListener('change', e => { if (e.target.name === 'kind') relabel(); });
    let list = [];
    reports().then(r => { list = r; look(); }).catch(() => {});
    let tm;
    const look = () => {
      const hits = similar(f.title.value + ' ' + f.what.value, list, 3);
      if (!hits.length) { dup.hidden = true; dup.innerHTML = ''; return; }
      dup.hidden = false;
      dup.innerHTML = '<b>Already reported? Tap “Me too” instead of sending it again.</b>' + hits.map(r => `<div class="dupi"><span class="t">#${r.id} ${esc(r.title)}<small>${esc(statusLabel(r.status))}${r.votes ? ' · ' + r.votes + ' me too' : ''}${r.mine ? ' · your report' : ''}</small></span>${r.mine ? '' : `<button type="button" data-v="${r.id}" class="${r.voted ? 'on' : ''}" aria-pressed="${r.voted}">${r.voted ? 'Me too ✓' : 'Me too'}</button>`}</div>`).join('') + '<p>Something different? Keep going and send yours.</p>';
    };
    f.addEventListener('input', e => { e.target.classList.remove('err'); if (e.target.name === 'title' || e.target.name === 'what') { clearTimeout(tm); tm = setTimeout(look, 220); } });
    dup.addEventListener('click', async e => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      b.disabled = true;
      try { const j = await call('vote', { id: +b.dataset.v }); const r = list.find(x => x.id === +b.dataset.v); if (r) { r.voted = j.voted; r.votes += j.voted ? 1 : -1; } look(); s.textContent = j.voted ? 'Added your me too. You can close this, or send a new report if yours is different.' : 'Removed your me too.'; s.className = 's good'; window.dispatchEvent(new Event('dcb-beta-sent')); }
      catch (err) { s.textContent = err.message; s.className = 's bad'; b.disabled = false; }
    });
    (pre.title ? f.what : f.title).focus();
    if (pre.title) setTimeout(look, 300);
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const need = [[f.title, 4, 'Give your report a short title.'], [f.area, 1, 'Pick where it happened.'], [f.what, 10, 'Tell us a little more about what happened.'], [f.expected, 3, f.kind.value === 'bug' ? 'Tell us what you expected to happen.' : 'Fill in the last box too.']];
      for (const [el, n, msg] of need) if (el.value.trim().length < n) { s.textContent = msg; s.className = 's bad'; el.classList.add('err'); el.focus(); return; }
      send.disabled = true; s.textContent = 'Sending…'; s.className = 's';
      const page = (document.title || '') + ' · ' + location.pathname + location.hash;
      const device = `${navigator.userAgent} · screen ${screen.width}x${screen.height} · window ${innerWidth}x${innerHeight}`;
      try {
        const j = await call('report', { kind: f.kind.value, title: f.title.value, area: f.area.value, what: f.what.value, expected: f.expected.value, page, device });
        reportsCache = null;
        s.innerHTML = 'Thank you! Report #' + j.id + ' is on its way. Follow it on your <a href="/beta-board">Beta board</a>.'; s.className = 's good';
        f.querySelectorAll('input[type=text],textarea').forEach(x => x.value = ''); dup.hidden = true;
        window.dispatchEvent(new CustomEvent('dcb-beta-sent', { detail: { id: j.id } }));
        setTimeout(close, 2600);
      } catch (err) { s.textContent = err.message || 'Your report couldn’t be sent. Check your connection and try again.'; s.className = 's bad'; }
      send.disabled = false;
    });
  }
  window.DCBBeta = { open, call, reports, similar, tester, heart, esc, statusLabel, STEPS, AREAS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  window.addEventListener('dcb-beta', () => { isTester = null; build(); });
})();

// Signed in with the owner account: this device unlocks the private pages automatically (no team password needed).
(() => {
  if (/(?:^|; )dcb_team_ui=/.test(document.cookie)) return;
  if (/(?:^|; )dcb_beta_ui=/.test(document.cookie) && !/coming-soon/.test(location.pathname)) return;
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
    const j = await r.json().catch(() => ({}));
    if (j.beta) { if (/coming-soon/.test(location.pathname)) location.replace('/shop'); return; }
    document.documentElement.classList.add('team');
    if (/coming-soon/.test(location.pathname)) location.replace('/shop');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('dcb-auth', () => { try { sessionStorage.removeItem('dcb-team-tried'); } catch (e) {} run(); });
})();

// Owner and team devices: a "Private" menu with every locked page, so they're one tap away from anywhere on the site.
(() => {
  const LINKS = [['shop.html#today', 'Today'], ['shop.html#orders', 'Orders'], ['shop.html#calendar', 'Calendar'], ['request.html', 'Cake request form'], ['quote.html', 'Quote page'], ['portfolio.html', 'Cake gallery'], ['beta-admin', 'Beta admin'], ['beta-board', 'Beta board'], ['pricing', 'Pricing (draft)']];
  function add() {
    if (!document.documentElement.classList.contains('team') || document.querySelector('.dcb-priv')) return;
    const st = document.createElement('style');
    st.textContent = `.dcb-priv{position:relative}.dcb-priv>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:5px;font-weight:600;color:#9a1b5f;border:1px dashed #e3a8c7;border-radius:999px;padding:6px 11px;font-size:14px}.dcb-priv>summary::-webkit-details-marker{display:none}
.dcb-priv .pp{position:absolute;right:0;top:calc(100% + 6px);z-index:60;max-height:calc(100vh - 90px);overflow-y:auto;background:#fff;border:1px solid #eed3e3;border-radius:14px;box-shadow:0 18px 40px -20px #4b103d88;padding:6px;min-width:200px;display:flex;flex-direction:column}
.dcb-priv .pp a{padding:9px 12px;border-radius:9px;color:#4b103d;text-decoration:none;font-size:14.5px;font-weight:500}.dcb-priv .pp a:hover,.dcb-priv .pp a:focus-visible{background:#fff0f7}
.dcb-priv .pp small{padding:6px 12px 4px;color:#8a6a80;font-size:12px}
.menu-panel .dcb-privm,.dcb-menu-panel .dcb-privm{border-top:1px dashed #e3a8c7;margin-top:6px;padding-top:6px;display:flex;flex-direction:column}.dcb-privm small{color:#9a1b5f;font-weight:600;padding:6px 0;font-size:12.5px}`;
    document.head.appendChild(st);
    const html = LINKS.map(([h, l]) => `<a href="${h}">${l}</a>`).join('');
    const nav = document.querySelector('.site-nav');
    if (nav) {
      const d = document.createElement('details'); d.className = 'dcb-priv';
      d.innerHTML = `<summary aria-label="Private pages"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>Private</summary><div class="pp"><small>Only you can see these</small>${html}</div>`;
      const cta = nav.querySelector('.cta'); nav.insertBefore(d, cta || null);
      document.addEventListener('click', e => { if (d.open && !d.contains(e.target)) d.open = false; });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') d.open = false; });
    }
    document.querySelectorAll('.menu-panel, .dcb-menu-panel').forEach(p => { const m = document.createElement('div'); m.className = 'dcb-privm'; m.innerHTML = '<small>Private pages</small>' + html; p.appendChild(m); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
  new MutationObserver(add).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();

// Notifications bell for signed-in artists: new cake requests, customer approvals, and messages and updates from Dream Cake Builder staff.
(() => {
  const SB = 'https://gcorvodfcxhumesttwvj.supabase.co', KEY = 'sb_publishable_6ruYyVr__8c65Az5WCsiaA_jD9AcOgb', STORE = 'sb-gcorvodfcxhumesttwvj-auth-token';
  const stored = () => { try { const s = JSON.parse(localStorage.getItem(STORE)); return s && s.access_token ? s : null; } catch (e) { return null; } };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  if (window.self !== window.top || /[?&](embed|preview)=1/.test(location.search)) return;
  const authReady = () => window.DCBAuth ? Promise.resolve() : new Promise(res => { const s = document.createElement('script'); s.src = 'assets/dcb-auth.js'; s.onload = res; s.onerror = res; document.head.appendChild(s); });
  async function token() { if (!stored()) return ''; await authReady(); try { const s = window.DCBAuth && await window.DCBAuth.session(); return s && s.access_token || ''; } catch (e) { return ''; } }
  async function rpc(fn) { const t = await token(); if (!t) throw new Error('signin'); const r = await fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: '{}' }); if (!r.ok) throw new Error('failed'); const tx = await r.text(); return tx ? JSON.parse(tx) : null; }
  const IC = {
    request: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
    approved: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.7 2.7L16 10"/>',
    declined: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    changes: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    message: '<path d="M4 5h16v11H9l-5 4z"/>',
    paid: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/>',
    reply: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
    update: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/>',
    tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'
  };
  const KL = { paid: 'Payment received', reply: 'Customer reply', request: 'Cake request', approved: 'Approved', declined: 'Declined', changes: 'Changes asked', message: 'From Dream Cake Builder', update: 'What’s new', tip: 'Tip' };
  const ago = d => { const s = (Date.now() - new Date(d)) / 1000; if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + ' min ago'; if (s < 86400) return Math.floor(s / 3600) + ' hr ago'; if (s < 604800) return Math.floor(s / 86400) + (s < 172800 ? ' day ago' : ' days ago'); return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); };
  let D = null, wrap = null, timer = null;
  function css() {
    if (document.getElementById('dcb-bell-css')) return; const st = document.createElement('style'); st.id = 'dcb-bell-css';
    st.textContent = `.dcb-bell{position:relative;flex:none;display:flex}.dcb-bell>button{position:relative;width:40px;height:40px;border-radius:12px;border:1px solid #eed3e3;background:#fff;color:#4b103d;display:grid;place-items:center;cursor:pointer}.dcb-bell>button:hover{background:#fff4f9}.dcb-bell>button:focus-visible{outline:2px solid #c12c7e;outline-offset:2px}.dcb-bell>button svg{width:20px;height:20px}
.dcb-bell .n{position:absolute;top:-5px;right:-5px;min-width:19px;height:19px;padding:0 5px;border-radius:999px;background:#c12c7e;color:#fff;font:700 11px/19px Inter,system-ui,sans-serif;text-align:center;box-shadow:0 0 0 2px #fff}
.dcb-bpanel{position:fixed;z-index:80;width:min(380px,calc(100vw - 16px));max-height:min(560px,calc(100vh - 80px));display:flex;flex-direction:column;background:#fff;border:1px solid #eed3e3;border-radius:18px;box-shadow:0 24px 60px -24px #4b103d99;overflow:hidden;font:15px/1.45 Inter,system-ui,sans-serif;color:#3a1030}
.dcb-bpanel[hidden]{display:none}.dcb-bpanel .bh{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;border-bottom:1px solid #f3e0ea}.dcb-bpanel .bh b{font:600 18px Fraunces,Georgia,serif}.dcb-bpanel .bh button{border:0;background:none;font:inherit;font-size:13px;color:#9a1b5f;cursor:pointer;padding:6px}
.dcb-bpanel .bl{overflow-y:auto;padding:6px}.dcb-bpanel .bi{display:flex;gap:11px;padding:10px;border-radius:12px;color:inherit;text-decoration:none;position:relative}.dcb-bpanel a.bi:hover,.dcb-bpanel a.bi:focus-visible{background:#fff4f9;outline:none}
.dcb-bpanel .bi i{flex:none;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:#fde3f0;color:#9a1b5f}.dcb-bpanel .bi i svg{width:18px;height:18px}.dcb-bpanel .bi.k-paid i,.dcb-bpanel .bi.k-approved i{background:#e3f5e8;color:#22703c}.dcb-bpanel .bi.k-declined i,.dcb-bpanel .bi.k-changes i{background:#fff2d6;color:#7a5410}.dcb-bpanel .bi.k-update i,.dcb-bpanel .bi.k-tip i{background:#eaf3ff;color:#244d84}
.dcb-bpanel .bt2{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}.dcb-bpanel .bt2 small{font-size:11.5px;font-weight:600;color:#8a6a80}.dcb-bpanel .bt2 b{font-weight:600;font-size:14.5px;line-height:1.3}.dcb-bpanel .bt2 span{font-size:13.5px;color:#6b4a62;overflow-wrap:anywhere}.dcb-bpanel .bt2 time{font-size:12px;color:#8a6a80}
.dcb-bpanel .bi.new::after{content:"";position:absolute;right:10px;top:14px;width:8px;height:8px;border-radius:50%;background:#c12c7e}.dcb-bpanel .bi.new .bt2{padding-right:14px}
.dcb-bpanel .be{padding:30px 20px;text-align:center;color:#8a6a80;font-size:14px}.dcb-bpanel .bf{border-top:1px solid #f3e0ea;padding:10px 16px;font-size:13px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.dcb-bpanel .bf a{color:#9a1b5f;font-weight:600}
header .dcb-bell{margin-left:6px}.head-in .dcb-bell{margin-left:8px}@media(max-width:860px){.head-in .dcb-bell{margin-left:auto}.head-in .dcb-bell+details.menu{margin-left:8px}}@media(prefers-reduced-motion:no-preference){.dcb-bell.ring>button svg{animation:dcbring .9s ease 1}}@keyframes dcbring{0%,100%{transform:rotate(0)}20%{transform:rotate(14deg)}40%{transform:rotate(-12deg)}60%{transform:rotate(8deg)}80%{transform:rotate(-4deg)}}`;
    document.head.appendChild(st);
  }
  function mount() {
    if (wrap) return true; const hi = document.querySelector('.site-head .head-in'), sh = document.querySelector('header .spacer');
    if (!hi && !sh) return false; css();
    wrap = document.createElement('div'); wrap.className = 'dcb-bell';
    wrap.innerHTML = `<button type="button" aria-label="Notifications" aria-haspopup="dialog" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/></svg><span class="n" hidden></span></button>`;
    if (hi) { const menu = hi.querySelector('details.menu'); if (menu) hi.insertBefore(wrap, menu); else hi.appendChild(wrap); }
    else sh.after(wrap);
    const p = document.createElement('div'); p.className = 'dcb-bpanel'; p.id = 'dcbBellPanel'; p.hidden = true; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Notifications'); document.body.appendChild(p);
    const btn = wrap.querySelector('button');
    btn.addEventListener('click', () => p.hidden ? open() : close());
    document.addEventListener('click', e => { if (!p.hidden && !p.contains(e.target) && !wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !p.hidden) { close(); btn.focus(); } });
    addEventListener('resize', () => { if (!p.hidden) place(); });
    return true;
  }
  function place() { const p = document.getElementById('dcbBellPanel'), r = wrap.querySelector('button').getBoundingClientRect(); p.style.top = Math.round(r.bottom + 8) + 'px'; const w = Math.min(380, innerWidth - 16), right = Math.max(8, Math.round(innerWidth - r.right)); const fit = Math.min(right, innerWidth - w - 8); p.style.left = 'auto'; p.style.right = Math.max(8, fit) + 'px'; }
  function badge() { const n = wrap.querySelector('.n'), u = D ? D.unread : 0; n.hidden = !u; n.textContent = u > 9 ? '9+' : String(u); wrap.querySelector('button').setAttribute('aria-label', u ? `Notifications, ${u} new` : 'Notifications'); }
  function draw() {
    const p = document.getElementById('dcbBellPanel'), seen = D && D.seen_at ? new Date(D.seen_at) : new Date(0), items = (D && D.items) || [];
    p.innerHTML = `<div class="bh"><b>Notifications</b>${items.length ? '<button type="button" data-bclose>Close</button>' : ''}</div><div class="bl">${items.length ? items.map(it => { const href = it.link ? (/^https:\/\//.test(it.link) ? it.link : (it.link.startsWith('/') ? it.link : '/' + it.link)) : ''; const inner = `<i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[it.kind] || IC.message}</svg></i><span class="bt2"><small>${esc(KL[it.kind] || 'Notice')}</small><b>${esc(it.title)}</b>${it.body ? `<span>${esc(it.body)}</span>` : ''}<time datetime="${esc(it.at)}">${esc(ago(it.at))}</time></span>`; const cls = `bi k-${esc(it.kind)}${new Date(it.at) > seen ? ' new' : ''}`; return href ? `<a class="${cls}" href="${esc(href)}"${/^https:\/\//.test(href) ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>` : `<div class="${cls}">${inner}</div>`; }).join('') : '<div class="be">You’re all caught up. New cake requests, approvals and news from Dream Cake Builder show up here.</div>'}</div>
     <div class="bf"><a href="/shop#requests">All requests</a>${D && D.admin ? '<a href="/beta-admin#notices">Send a notice</a>' : ''}</div>`;
    const c = p.querySelector('[data-bclose]'); if (c) c.onclick = close;
  }
  async function load() { try { D = await rpc('dcb_my_notifications'); if (!D) return; const before = +(wrap.dataset.u || 0); badge(); if (D.unread > before && before >= 0 && wrap.dataset.u) { wrap.classList.remove('ring'); void wrap.offsetWidth; wrap.classList.add('ring'); } wrap.dataset.u = D.unread; if (!document.getElementById('dcbBellPanel').hidden) draw(); } catch (e) { if (e.message === 'signin') stop(); } }
  function open() { const p = document.getElementById('dcbBellPanel'); draw(); place(); p.hidden = false; wrap.querySelector('button').setAttribute('aria-expanded', 'true'); if (D && D.unread) { rpc('dcb_notifications_seen').catch(() => {}); D.unread = 0; wrap.dataset.u = '0'; badge(); } }
  function close() { const p = document.getElementById('dcbBellPanel'); p.hidden = true; wrap.querySelector('button').setAttribute('aria-expanded', 'false'); if (D) D.seen_at = new Date().toISOString(); }
  function stop() { if (timer) clearInterval(timer); timer = null; if (wrap) { wrap.remove(); wrap = null; const p = document.getElementById('dcbBellPanel'); if (p) p.remove(); } }
  function start() { if (!stored()) { stop(); return; } if (!mount()) return; load(); if (!timer) timer = setInterval(() => { if (!document.hidden) load(); }, 120000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  addEventListener('dcb-auth', () => setTimeout(start, 50));
  addEventListener('focus', () => { if (wrap) load(); });
})();

// Error reporting: if something breaks in a visitor's browser, quietly note the page and message (no personal details)
// so the team sees real problems before anyone has to report them. Repeats of the same error are counted, not re-sent.
(() => {
  if (!/^https:$/.test(location.protocol)) return;
  const SB = 'https://gcorvodfcxhumesttwvj.supabase.co', KEY = 'sb_publishable_6ruYyVr__8c65Az5WCsiaA_jD9AcOgb';
  const sent = new Set(); let n = 0;
  const ours = src => !src || src.startsWith(location.origin) || src.startsWith(SB);
  const skip = m => /ResizeObserver loop|Script error\.?$|Non-Error promise rejection|AbortError|The operation was aborted|Load failed|Failed to fetch|NetworkError|cancelled|chrome-extension|moz-extension|safari-(web-)?extension/i.test(m);
  function report(message, source, stack) {
    try {
      message = String(message || '').slice(0, 500);
      if (!message || skip(message) || skip(String(stack || '')) || !ours(source || '')) return;
      const key = message + '|' + source; if (sent.has(key) || n >= 10) return; sent.add(key); n++;
      let token = '';
      try { const s = JSON.parse(localStorage.getItem('sb-gcorvodfcxhumesttwvj-auth-token')); if (s && s.access_token && s.expires_at > Date.now() / 1000 + 30) token = s.access_token; } catch (e) {}
      fetch(SB + '/rest/v1/rpc/dcb_log_error', { method: 'POST', keepalive: true,
        headers: { apikey: KEY, Authorization: 'Bearer ' + (token || KEY), 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_page: location.pathname + location.hash.replace(/[?&](t|code|token)=[^&]*/g, ''), p_message: message, p_source: String(source || '').slice(0, 300), p_stack: String(stack || '').slice(0, 2000), p_agent: navigator.userAgent.slice(0, 300) })
      }).catch(() => {});
    } catch (e) {}
  }
  window.addEventListener('error', e => { if (e && e.message) report(e.message, (e.filename || '') + (e.lineno ? ':' + e.lineno + ':' + (e.colno || 0) : ''), e.error && e.error.stack); });
  window.addEventListener('unhandledrejection', e => { const r = e && e.reason; report(r && (r.message || r) || 'Unhandled promise rejection', (r && r.stack && (String(r.stack).match(/https?:\/\/[^\s)]+/) || [''])[0]) || location.href, r && r.stack); });
  window.DCBReportError = report;
})();

/* Show / hide for every password box on the site (sign in, new password, beta setup). */
(function () {
  if (window.__dcbPwEye) return; window.__dcbPwEye = true;
  const css = document.createElement('style');
  css.textContent = '.pweye{position:relative;display:block}.pweye>input{padding-right:62px!important;width:100%}.pweye>button{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:none;color:var(--rose-ink,#8c1d5c);font:600 12.5px Inter,Arial,sans-serif;padding:6px 8px;border-radius:8px;cursor:pointer;min-height:32px}.pweye>button:hover{background:var(--rose-soft,#fde3ee)}.pweye>button:focus-visible{outline:2px solid var(--rose,#c12c7e)}';
  document.head.appendChild(css);
  const wrap = (inp) => {
    if (inp.dataset.eye || !inp.parentNode) return; inp.dataset.eye = '1';
    const w = document.createElement('span'); w.className = 'pweye';
    inp.parentNode.insertBefore(w, inp); w.appendChild(inp);
    const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Show';
    b.setAttribute('aria-label', 'Show password'); b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      const show = inp.type === 'password'; inp.type = show ? 'text' : 'password';
      b.textContent = show ? 'Hide' : 'Show'; b.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); b.setAttribute('aria-pressed', String(show));
      inp.focus();
    });
    w.appendChild(b);
  };
  const scan = (root) => (root.querySelectorAll ? root.querySelectorAll('input[type=password]') : []).forEach(wrap);
  const start = () => { scan(document); new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) { if (n.matches && n.matches('input[type=password]')) wrap(n); scan(n); } }))).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  // Before a form is sent, put passwords back to hidden so browsers offer to save them.
  document.addEventListener('submit', () => document.querySelectorAll('.pweye>input').forEach((i) => { if (i.type === 'text') { i.type = 'password'; const b = i.nextSibling; if (b) { b.textContent = 'Show'; b.setAttribute('aria-pressed', 'false'); } } }), true);
})();
