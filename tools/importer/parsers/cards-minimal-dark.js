/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-minimal-dark.
 * Base block: cards. Source has NO images, so the "no images" variant applies:
 * 1 column; first row = block name, each subsequent row = one card (single cell)
 * holding the related-story title (as a linked heading) and its date.
 * Source: https://wknd.site/ca/en/magazine/arctic-surfing.html
 * Selectors validated against migration-work/block-context/cards-minimal-dark/source.html
 */
export default function parse(element, { document }) {
  // Each related-story list item is one card.
  const items = Array.from(element.querySelectorAll('.cmp-list__item'));

  const cells = [];
  items.forEach((item) => {
    const link = item.querySelector('a.cmp-list__item-link, a');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const titleText = (
      item.querySelector('.cmp-list__item-title') || link
    ).textContent.trim();
    const dateEl = item.querySelector('.cmp-list__item-date');

    if (!titleText) return; // title is the essential card content

    const cardCell = [];

    // Title as a linked heading.
    const heading = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.setAttribute('href', href);
    titleLink.textContent = titleText;
    heading.append(titleLink);
    cardCell.push(heading);

    // Date as description text.
    if (dateEl && dateEl.textContent.trim()) {
      const dateP = document.createElement('p');
      dateP.textContent = dateEl.textContent.trim();
      cardCell.push(dateP);
    }

    cells.push([cardCell]); // 1-column: one row, one cell holding all elements
  });

  // Empty-block guard: no cards found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards (minimal-dark)',
    cells,
  });
  element.replaceWith(block);
}
