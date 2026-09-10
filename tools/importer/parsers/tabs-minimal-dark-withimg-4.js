/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-minimal-dark-withimg-4.
 * FORKED block (own folder blocks/tabs-minimal-dark-withimg-4/) — a filterable card grid.
 * Content contract (from the block's decorate logic, which is authoritative for a fork):
 *   Row 1 — filter labels, one cell per label (ALL / CLIMBING / CYCLING / SKIING / SURFING / TRAVEL).
 *           The first label is the "show all" default.
 *   Rows 2..n — adventure cards. Each card row has 2 cells: image cell + text cell
 *           (title link + description).
 * Source: https://wknd.site/ca/en/adventures.html — a .tabs.panelcontainer > .cmp-tabs with a
 *   filter tablist and per-category tabpanels. The active "All" panel holds every card, so we
 *   read cards from it to get the full, de-duplicated grid.
 * Selectors validated against migration-work/block-context/tabs-minimal-dark-withimg-4/source.html
 */
export default function parse(element, { document }) {
  // Filter labels from the tab list.
  const labels = Array.from(element.querySelectorAll('.cmp-tabs__tab'))
    .map((tab) => tab.textContent.trim())
    .filter(Boolean);

  // Cards: prefer the active "All" panel (holds every adventure once); fall back to the
  // first panel, then to any image-list items in the block.
  const allPanel = element.querySelector('.cmp-tabs__tabpanel--active')
    || element.querySelector('.cmp-tabs__tabpanel');
  const scope = allPanel || element;
  const items = Array.from(scope.querySelectorAll('.cmp-image-list__item'));

  const cells = [];

  // Row 1: filter labels (one cell each).
  if (labels.length) cells.push(labels);

  // Card rows: image cell + text cell.
  items.forEach((item) => {
    const image = item.querySelector('img.cmp-image__image, .cmp-image img, img');

    const textCell = [];
    // Title as a link (preserve href for navigation).
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const title = titleLink.textContent.trim();
      if (title) {
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href') || '';
        a.textContent = title;
        const strong = document.createElement('strong');
        strong.append(a);
        textCell.push(strong);
      }
    }
    // Description.
    const desc = item.querySelector('.cmp-image-list__item-description');
    const descText = desc && desc.textContent.trim();
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      textCell.push(p);
    }

    // Only emit a card row with usable content.
    if (image || textCell.length) {
      cells.push([image || '', textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard: no labels and no cards found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'tabs-minimal-dark-withimg-4',
    cells,
  });
  element.replaceWith(block);
}
