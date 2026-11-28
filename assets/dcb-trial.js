/* Dream Cake Studio free preview: visitors get 15 minutes of design time, then the Studio asks them to join.
   Not limited: signed-in accounts, beta artists, team devices, and client review links (view=1 or ?review=). */
(() => {
  const q = new URLSearchParams(location.search);
  if (q.get('view') === '1' || q.has('review') || window.DCS_VIEWER || window.top !== window) return;
  if (/(?:^|; )dcb_team(?:_ui)?=/.test(document.cookie)) return;
  const ls = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  if (ls('dcb-beta-code')) return;
  const signedIn = () => { try { const s = JSON.parse(ls('sb-gcorvodfcxhumesttwvj-auth-token') || 'null'); return !!(s && (s.access_token || s.refresh_token)); } catch (e) { return false; } };
  if (signedIn()) return;

  const LIMIT = 15 * 60, KEY = 'dcb-preview-used', STEP = 5;
  const read = () => { const v = parseInt(ls(KEY) || '0', 10); const c = (document.cookie.match(/(?:^|; )dcb_pv=(\d+)/) || [])[1]; return Math.max(isFinite(v) ? v : 0, c ? +c : 0); };
  const write = n => { try { localStorage.setItem(KEY, String(n)); } catch (e) {} document.cookie = 'dcb_pv=' + n + '; max-age=31536000; path=/; SameSite=Lax'; };
  let used = read(), locked = false, chip = null;

  const css = document.createElement('style');
  css.textContent = `.dcb-pv{position:fixed;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:9000;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #eed3e3;border-radius:999px;padding:6px 6px 6px 12px;font:600 13px/1 Inter,system-ui,sans-serif;color:#4b103d;box-shadow:0 8px 22px -12px #4b103d88}
.dcb-pv a{background:#c12c7e;color:#fff;text-decoration:none;border-radius:999px;padding:7px 11px}
.dcb-pvx h2,.dcb-pvx a{text-transform:none}
@media(max-width:700px){.dcb-pv{top:calc(66px + env(safe-area-inset-top));bottom:auto;right:8px;font-size:12px;padding:4px 4px 4px 10px}.dcb-pv a{padding:6px 9px}}
.dcb-pv.low{border-color:#f3a6c8;background:#fff4f9}.dcb-pv .t{white-space:nowrap}
.dcb-pvx{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;background:#2b1424b3;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.dcb-pvx .c{width:min(460px,100%);background:#fff;border-radius:26px;overflow:hidden;box-shadow:0 40px 80px -30px #000;font:15.5px/1.55 Inter,system-ui,sans-serif;color:#4b103d;text-align:center}
.dcb-pvx .top{background:#fbe3ee url(assets/home/mascot-bg.png) center/210px auto repeat;padding:26px 20px 16px}.dcb-pvx .top img{width:92px;height:92px}
.dcb-pvx .bd{padding:18px 24px 24px}.dcb-pvx h2{font:600 26px/1.15 Fraunces,Georgia,serif;margin:0 0 8px}.dcb-pvx p{margin:0 0 6px;color:#79536e}
.dcb-pvx .acts{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.dcb-pvx .acts a{display:flex;align-items:center;justify-content:center;min-height:48px;border-radius:12px;text-decoration:none;font-weight:600;border:1px solid #eed3e3;color:#4b103d}
.dcb-pvx .acts a.p{background:#c12c7e;border-color:#c12c7e;color:#fff}.dcb-pvx .small{font-size:13.5px;margin-top:10px}.dcb-pvx .small a{color:#9a1b5f}`;
  document.head.appendChild(css);

  const mins = () => Math.max(0, Math.ceil((LIMIT - used) / 60));
  function showChip() {
    if (locked) return;
    if (!chip) { chip = document.createElement('div'); chip.className = 'dcb-pv'; chip.setAttribute('role', 'status'); document.body.appendChild(chip); }
    const m = mins();
    chip.classList.toggle('low', m <= 3);
    chip.innerHTML = `<span class="t">Free preview · ${m} min left</span><a href="index.html#launch-list">Join</a>`;
  }
  function lock() {
    if (locked) return; locked = true;
    if (chip) chip.remove();
    const x = document.createElement('div');
    x.className = 'dcb-pvx';
    x.innerHTML = `<div class="c" role="dialog" aria-modal="true" aria-labelledby="pvT"><div class="top"><img src="lilac/assets/favicon.svg" alt=""></div><div class="bd">
<h2 id="pvT">That's your free 15 minutes!</h2><p>Thanks for trying Dream Cake Studio. We're opening it to cake artists soon.</p><p>Join the waitlist to hear the moment it opens, or apply to be a Beta Artist and keep designing now.</p>
<div class="acts"><a class="p" href="index.html#launch-list">Join the waitlist</a><a href="beta#apply">Become a Beta Artist</a></div>
<p class="small">Already a member? <a href="account.html?next=${encodeURIComponent('/studio.html')}">Sign in</a></p></div></div>`;
    document.body.appendChild(x);
    [...document.body.children].forEach(el => { if (el !== x) el.setAttribute('inert', ''); });
    x.querySelector('a').focus();
  }
  const start = () => {
    if (used >= LIMIT) { lock(); return; }
    showChip();
    setInterval(() => {
      if (locked || document.visibilityState !== 'visible') return;
      if (signedIn()) { if (chip) chip.remove(); locked = true; return; }
      used = Math.max(used, read()) + STEP; write(used);
      if (used >= LIMIT) lock(); else showChip();
    }, STEP * 1000);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
