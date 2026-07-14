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
      '<p class="mono" style="color:var(--accent-text);font-size:15px;">✓ You\'re on the list — we onboard in small waves and will be in touch.</p>';
  } catch {
    // Worker not deployed yet (or offline) — fall back to a prefilled email
    status.textContent = 'Opening your mail app instead…';
    const body = encodeURIComponent(
      'Name: ' + name + '\nEmail: ' + email + '\n\nWhat I want to run on it:\n' + why
    );
    window.location.href = 'mailto:join@nautlense.com?subject=' +
      encodeURIComponent('NautLoop early access') + '&body=' + body;
    btn.disabled = false;
  }
});
