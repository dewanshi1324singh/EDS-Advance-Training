import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * tabs-minimal-dark-withimg-4 (excat-generated) — a FORKED tabs variant.
 * Structure from source: a horizontal filter bar (ALL + category labels) above a
 * grid of image + title + description cards. Clicking a filter shows only the cards
 * whose category matches. This is a self-contained block — it must target only its
 * own class (.tabs-minimal-dark-withimg-4), never the base tabs block class.
 *
 * Content contract (standalone):
 *   Row 1 — filter labels (one cell per label, first label is the "show all" default).
 *   Rows 2..n — cards. Each card row: image cell + text cell. The card's category is
 *   read from a data attribute the author may set via the text; when absent the card
 *   shows under every filter.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // First row is the filter bar.
  const [filterRow, ...cardRows] = rows;
  const labels = [...filterRow.children]
    .map((cell) => cell.textContent.trim())
    .filter(Boolean);

  // Build the card grid.
  const ul = document.createElement('ul');
  ul.className = 'tabs-minimal-dark-withimg-4-grid';
  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'tabs-minimal-dark-withimg-4-card';
    while (row.firstElementChild) {
      const div = row.firstElementChild;
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'tabs-minimal-dark-withimg-4-card-image';
      } else {
        div.className = 'tabs-minimal-dark-withimg-4-card-body';
      }
      li.append(div);
    }
    // Category defaults to a data attribute on the row if provided.
    const category = (row.dataset.category || '').toLowerCase();
    if (category) li.dataset.category = category;
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // Build the filter bar (skip if the author provided no labels).
  let bar;
  if (labels.length) {
    bar = document.createElement('div');
    bar.className = 'tabs-minimal-dark-withimg-4-filters';
    bar.setAttribute('role', 'tablist');
    labels.forEach((label, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tabs-minimal-dark-withimg-4-filter';
      button.textContent = label;
      button.dataset.filter = i === 0 ? '' : label.toLowerCase();
      button.setAttribute('aria-selected', i === 0);
      button.addEventListener('click', () => {
        const value = button.dataset.filter;
        bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', b === button));
        ul.querySelectorAll('.tabs-minimal-dark-withimg-4-card').forEach((card) => {
          const show = !value || !card.dataset.category || card.dataset.category === value;
          card.hidden = !show;
        });
      });
      bar.append(button);
    });
  }

  block.replaceChildren();
  if (bar) block.append(bar);
  block.append(ul);
}
