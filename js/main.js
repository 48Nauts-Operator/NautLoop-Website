// Theme toggle — persists to localStorage; initial theme set inline in <head> pre-paint.
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('nl-theme', next);
});
