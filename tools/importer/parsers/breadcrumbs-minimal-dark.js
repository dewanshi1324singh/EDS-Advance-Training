/* eslint-disable */
/* global WebImporter */
/**
 * Parser for breadcrumbs-minimal-dark.
 * Base block: breadcrumbs (1 column; each row is one crumb — a link for
 * intermediate crumbs, plain text for the current/active page).
 * Source: https://wknd.site/ca/en/adventures/bali-surf-camp.html
 * Selectors validated against migration-work/block-context/breadcrumbs-minimal-dark/source.html
 */
export default function parse(element, { document }) {
  // Each <li> in the breadcrumb list is one crumb.
  const items = Array.from(
    element.querySelectorAll('.cmp-breadcrumb__item, li'),
  );

  const cells = [];
  items.forEach((item) => {
    const link = item.querySelector('a');
    if (link) {
      // Intermediate crumb: keep the link (label lives inside a <span>).
      const span = link.querySelector('span');
      if (span) link.textContent = span.textContent.trim();
      cells.push([link]);
    } else {
      // Active/current crumb: plain text only.
      const text = item.textContent.trim();
      if (text) cells.push([text]);
    }
  });

  // Empty-block guard: no crumbs found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'breadcrumbs (minimal-dark)',
    cells,
  });
  element.replaceWith(block);
}
