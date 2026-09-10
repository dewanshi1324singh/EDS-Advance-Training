/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-minimal-dark-withimg-2.
 * Base block: hero (1 column; first row = block name, row 2 = optional background image,
 * row 3 = optional content: title / subheading / CTA).
 * Source: https://wknd.site/ca/en/magazine/arctic-surfing.html
 * Selectors validated against migration-work/block-context/hero-minimal-dark-withimg-2/source.html
 * Source is a full-width lead image (single image cell); no title/CTA present in source.
 */
export default function parse(element, { document }) {
  // Full-width lead image.
  const image = element.querySelector('img.cmp-image__image, .cmp-image img, img');

  // Optional text content (handled defensively for pages that add a headline / CTA).
  const heading = element.querySelector('h1, h2, h3, .cmp-title__text, [class*="title"]');
  const description = element.querySelector('p:not([class*="occupation"]), [class*="subtitle"]');
  const ctaLinks = Array.from(element.querySelectorAll('a.cmp-button, a.cta, a.button'));

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
    name: 'hero (minimal-dark-withimg-2)',
    cells,
  });
  element.replaceWith(block);
}
