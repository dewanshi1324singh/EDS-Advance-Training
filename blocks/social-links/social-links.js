/*
 * Social Links block.
 * Author contract (one row per platform):
 *   | social-links      |
 *   | Facebook | https://facebook.com/wknd |
 *   | Twitter  | https://twitter.com/wknd  |
 * Cell 1 = platform name (used to pick the icon), cell 2 = profile URL.
 * A single-cell row holding just a link also works — the platform is inferred
 * from the URL host.
 */

// Platforms we ship an icon for (icons/<name>.svg). Extend by dropping a new SVG in /icons.
const KNOWN = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];

/** Infer a platform key from a label and/or href. */
function platformKey(label, href) {
  const hay = `${label} ${href}`.toLowerCase();
  return KNOWN.find((p) => hay.includes(p)) || null;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'social-links-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const link = row.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : (cells[1]?.textContent || '').trim();
    if (!href) return;
    const label = (cells[0]?.textContent || link?.textContent || '').trim();
    const key = platformKey(label, href);

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.className = 'social-links-item';
    a.setAttribute('aria-label', label || key || 'Social link');
    a.setAttribute('rel', 'noopener');
    if (/^https?:/i.test(href)) a.target = '_blank';

    if (key) {
      const img = document.createElement('img');
      img.src = `${window.hlx?.codeBasePath || ''}/icons/${key}.svg`;
      img.alt = label || key;
      img.loading = 'lazy';
      img.width = 20;
      img.height = 20;
      a.append(img);
    } else {
      // no icon available — fall back to the text label
      a.textContent = label || href;
    }
    li.append(a);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
