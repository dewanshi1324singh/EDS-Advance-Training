/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-minimal-dark-withimg-5.
 * Base block: hero (1 column; first row = block name, row 2 = optional background image,
 * row 3 = optional content: title / subheading / CTA).
 * Source: https://wknd.site/ca/en/adventures.html
 * Selectors validated against migration-work/block-context/hero-minimal-dark-withimg-5/source.html
 * Source is a .teaser.cmp-teaser--hero: overlaid text panel (h2 title + description paragraph)
 * plus a full-width lead image. No CTA present in source; handled defensively.
 */
export default function parse(element, { document }) {
  // Full-width lead / background image.
  const image = element.querySelector('img.cmp-image__image, .cmp-teaser__image img, .cmp-image img, img');

  // Overlaid text panel.
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
  const description = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description, p, [class*="subtitle"]');
  const ctaLinks = Array.from(element.querySelectorAll('a.cmp-teaser__action-link, a.cmp-button, a.cta, a.button'));

  const cells = [];

  // Row 2: background / lead image (optional).
  if (image) cells.push([image]);

  // Row 3: content cell (optional) — one cell holding all text elements.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  if (contentCell.length) cells.push([contentCell]);

  // Empty-block guard: nothing usable found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero (minimal-dark-withimg-5)',
    cells,
  });
  element.replaceWith(block);
}
