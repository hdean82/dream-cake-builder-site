/* Dream Cake Builder — shared site script: menu, image fallback, waitlist form */
{
  // close the phone menu after choosing a link or tapping outside
  const menu = document.querySelector('.menu');
  if (menu) {
    menu.addEventListener('click', e => { if (e.target.closest('a')) menu.open = false; });
    document.addEventListener('click', e => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') menu.open = false; });
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

  // waitlist: saves to the Supabase launch_subscribers table (same as the current site)
  const form = document.getElementById('launchForm');
  if (form) {
    const SUPABASE_URL = 'https://gcorvodfcxhumesttwvj.supabase.co';
    const PUBLISHABLE_KEY = 'sb_publishable_6ruYyVr__8c65Az5WCsiaA_jD9AcOgb';
    const status = document.getElementById('launchStatus');
    let busy = false;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (busy || !form.reportValidity()) return;
      if (form.elements.website.value) return;            // spam trap
      busy = true;
      const btn = form.querySelector('button');
      btn.disabled = true; status.textContent = 'Joining the list…';
      try {
        const live = ['dreamcakebuilder.com', 'www.dreamcakebuilder.com'].includes(location.hostname);
        if (!live) { await new Promise(r => setTimeout(r, 500)); status.textContent = 'Preview only: on the live site this adds you to the list.'; return; }
        const res = await fetch(SUPABASE_URL + '/rest/v1/launch_subscribers', {
          method: 'POST',
          headers: { apikey: PUBLISHABLE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ email: form.elements.email.value.trim().toLowerCase(), news_updates: form.elements.news.checked }),
          signal: AbortSignal.timeout(15000)
        });
        if (!res.ok) { const err = await res.json().catch(() => ({})); if (err.code !== '23505') throw new Error('save failed'); }
        status.textContent = 'You’re on the list! Watch your inbox for launch news.';
        form.reset();
      } catch {
        status.textContent = 'We couldn’t save your email. Please try again in a moment.';
      } finally { busy = false; btn.disabled = false; }
    });
  }
}
