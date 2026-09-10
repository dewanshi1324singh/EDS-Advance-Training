import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * hero-minimal-dark-withimg-4 (excat-generated) — a FORKED hero variant.
 * Structure from source: a section heading above a grid of image + title +
 * description teaser cards (e.g. the WKND "Members Only" listing). This is a
 * self-contained block — scoped to .hero-minimal-dark-withimg-4 only, never the base hero class.
 *
 * Content contract (standalone):
 *   Optional first row with a single heading cell (no image) = section heading.
 *   Remaining rows = cards: image cell + text cell.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // A leading row that has a heading and no image is treated as the section title.
  let headingRow = null;
  if (rows.length
    && rows[0].querySelector('h1,h2,h3,h4,h5,h6')
    && !rows[0].querySelector('picture')) {
    [headingRow] = rows.splice(0, 1);
  }

  const ul = document.createElement('ul');
  ul.className = 'hero-minimal-dark-withimg-4-grid';
  rows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'hero-minimal-dark-withimg-4-card';
    while (row.firstElementChild) {
      const div = row.firstElementChild;
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'hero-minimal-dark-withimg-4-card-image';
      } else {
        div.className = 'hero-minimal-dark-withimg-4-card-body';
      }
      li.append(div);
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren();
  if (headingRow) {
    const heading = document.createElement('div');
    heading.className = 'hero-minimal-dark-withimg-4-heading';
    while (headingRow.firstElementChild) heading.append(headingRow.firstElementChild);
    block.append(heading);
  }
  block.append(ul);
}
