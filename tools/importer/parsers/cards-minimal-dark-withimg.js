/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-minimal-dark-withimg.
 * Base block: cards (with images). 2 columns; first row = block name, each subsequent
 * row is one article card: cell 1 = card image (img), cell 2 = title (linked heading)
 * + description stacked.
 * The base cards.js decorate() assigns .cards-card-image to the image cell and
 * .cards-card-body to the content cell per row.
 * Source: https://wknd.site/ca/en.html (WKND image-list component)
 * Selectors validated against migration-work/block-context/cards-minimal-dark-withimg/source.html
 */
export default function parse(element, { document }) {
  // Each .cmp-image-list__item is one card.
  const items = Array.from(
    element.querySelectorAll('.cmp-image-list__item'),
  );

  const cells = [];
  items.forEach((item) => {
    // Card image.
    const img = item.querySelector(
      '.cmp-image-list__item-image-link img, .cmp-image img, img',
    );

    // Title link + inner title text.
    const titleLink = item.querySelector('.cmp-image-list__item-title-link, a[class*="title"]');
    const titleText = item.querySelector('.cmp-image-list__item-title');

    // Short description.
    const description = item.querySelector(
      '.cmp-image-list__item-description, [class*="description"]',
    );

    // Essential content guard for this card.
    if (!img && !titleLink && !titleText) return;

    const bodyCell = [];

    // Title as a linked heading (preserves the article link).
    const label = (titleText || titleLink)?.textContent.trim();
    if (label) {
      const heading = document.createElement('h3');
      const href = titleLink?.getAttribute('href');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = label;
        heading.append(a);
      } else {
        heading.textContent = label;
      }
      bodyCell.push(heading);
    }

    // Description below the heading.
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      bodyCell.push(p);
    }

    cells.push([img || '', bodyCell]);
  });

  // Empty-block guard: no cards found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards (minimal-dark-withimg)',
    cells,
  });
  element.replaceWith(block);
}
