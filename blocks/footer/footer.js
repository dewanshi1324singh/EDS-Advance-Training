/**
 * Fetch the footer fragment. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Normalize relative image paths (authored as `images/x.svg`) to root-absolute
  // so they resolve regardless of the current page path.
  footer.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
      img.setAttribute('src', `/${src}`);
    }
  });

  // Tag the sections by order so CSS can style them:
  // 0 = brand + footer nav, 1 = follow us + social, 2 = legal/copyright.
  const sections = ['footer-brand', 'footer-social', 'footer-legal'];
  [...footer.children].forEach((section, i) => {
    if (sections[i]) section.classList.add(sections[i]);
  });

  block.append(footer);
}
