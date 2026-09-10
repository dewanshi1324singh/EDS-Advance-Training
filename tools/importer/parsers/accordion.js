/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion.
 * Base block: accordion
 * Source: https://wknd.site/ca/en/faqs.html
 * Generated: 2026-09-10
 *
 * Block library convention (2 columns, one row per accordion item):
 *   - Cell 1: Title/label (the clickable question text)
 *   - Cell 2: Content (the answer body revealed when expanded)
 */
export default function parse(element, { document }) {
  // Each accordion entry in the source is a .cmp-accordion__item.
  const items = element.querySelectorAll('.cmp-accordion__item');

  const cells = [];

  items.forEach((item) => {
    // --- Title cell: the question text ---
    // Prefer the dedicated title span; fall back to the header button/heading text.
    const titleEl = item.querySelector(
      '.cmp-accordion__title, .cmp-accordion__button, .cmp-accordion__header',
    );
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // --- Content cell: the answer body ---
    // The panel holds the answer content. Extract its meaningful children so
    // headings, paragraphs, links, and images are preserved as HTML.
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = [];
    if (panel) {
      // Prefer the inner text/content wrapper if present, else the panel itself.
      const contentSource = panel.querySelector('.cmp-text') || panel;
      contentCell = Array.from(contentSource.childNodes).filter((node) => {
        // Keep element nodes and non-empty text nodes.
        if (node.nodeType === 1) return true;
        if (node.nodeType === 3) return node.textContent.trim().length > 0;
        return false;
      });
      // Fallback: if nothing extracted, use the whole panel content.
      if (contentCell.length === 0) {
        contentCell = Array.from(panel.childNodes);
      }
    }

    // Only add a row if we have at least a title or some content.
    if (titleText || contentCell.length) {
      cells.push([titleText, contentCell]);
    }
  });

  // Empty-block guard: if no items were found, unwrap gracefully.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
