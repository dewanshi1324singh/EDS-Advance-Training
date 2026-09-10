/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-minimal-dark-withimg.
 * Base block: columns (multi-column; first row = block name, row 2 = one cell per column).
 * Source: https://wknd.site/ca/en/magazine/arctic-surfing.html
 * Author byline footer: left cell = author photo + name + occupation, right cell = social links.
 * Selectors validated against migration-work/block-context/columns-minimal-dark-withimg/source.html
 */
export default function parse(element, { document }) {
  // Left column: author photo, name and occupation (byline).
  const byline = element.querySelector('.cmp-byline');
  const authorCell = [];
  if (byline) {
    const photo = byline.querySelector('img.cmp-image__image, .cmp-byline__image img, img');
    const name = byline.querySelector('.cmp-byline__name, h1, h2, h3');
    const occupation = byline.querySelector('.cmp-byline__occupations, p');
    if (photo) authorCell.push(photo);
    if (name) authorCell.push(name);
    if (occupation) authorCell.push(occupation);
  }

  // Right column: social links (Facebook, Twitter, Instagram, ...).
  const socialLinks = Array.from(
    element.querySelectorAll('.cmp-buildingblock--btn-list a.cmp-button, .buildingblock a.cmp-button, a.cmp-button'),
  );

  // Empty-block guard: no byline and no social links.
  if (!authorCell.length && !socialLinks.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([
    authorCell.length ? authorCell : '',
    socialLinks.length ? socialLinks : '',
  ]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns (minimal-dark-withimg)',
    cells,
  });
  element.replaceWith(block);
}
