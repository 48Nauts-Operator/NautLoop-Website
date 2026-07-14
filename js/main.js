// Theme toggle — persists to localStorage; initial theme set inline in <head> pre-paint.
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('nl-theme', next);
});

// Early-access form — POSTs to the Cloudflare Worker at /api/join;
// falls back to a prefilled email if the endpoint isn't live.
document.getElementById('ea-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('ea-name').value.trim();
  const email = document.getElementById('ea-email').value.trim();
  const why = document.getElementById('ea-why').value.trim();
  const honeypot = document.getElementById('ea-company').value;
  const status = document.getElementById('ea-status');
  const btn = document.querySelector('.ea-form .btn');
  if (!name || !email || !why || honeypot) return;

  btn.disabled = true;
  status.hidden = false;
  status.textContent = 'Sending…';
  try {
    const res = await fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, why }),
    });
    if (!res.ok) throw new Error('endpoint ' + res.status);
    document.getElementById('ea-form').innerHTML =
      '<div class="ea-success"><span class="ea-check">✓</span> You\'re on the list — we will be in touch.</div>';
  } catch {
    status.textContent = 'Something went wrong — please try again in a minute.';
    btn.disabled = false;
  }
});
