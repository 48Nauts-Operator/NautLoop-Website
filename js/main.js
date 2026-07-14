// Theme toggle — persists to localStorage; initial theme set inline in <head> pre-paint.
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('nl-theme', next);
});

// Early-access form — v1: prefilled email via the visitor's mail client.
// ponytail: no backend/third party; swap action for a CF Worker endpoint later.
document.getElementById('ea-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('ea-email').value.trim();
  if (!email) return;
  const body = encodeURIComponent(
    `Hi 48Nauts,\n\nplease onboard me to NautLoop early access.\nReach me at: ${email}\n\nWhat I want to run on it: `
  );
  window.location.href = `mailto:join@nautlense.com?subject=${encodeURIComponent('NautLoop early access')}&body=${body}`;
});
