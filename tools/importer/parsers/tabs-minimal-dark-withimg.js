/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-minimal-dark-withimg.
 * Base block: tabs (2 columns; first row = block name, each subsequent row is a tab:
 * cell 1 = tab label (mandatory), cell 2 = tab content (mandatory)).
 * Source: https://wknd.site/ca/en/adventures/bali-surf-camp.html
 * Selectors validated against migration-work/block-context/tabs-minimal-dark-withimg/source.html
 */
export default function parse(element, { document }) {
  // Tab labels and panels are parallel lists, paired by index.
  const tabs = Array.from(element.querySelectorAll('.cmp-tabs__tab'));
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  const cells = [];
  tabs.forEach((tab, i) => {
    const label = tab.textContent.trim();
    const panel = panels[i];
    if (!label || !panel) return;

    // Extract meaningful content from the panel: text (excluding the repeated
    // content-fragment title) plus any inline images. Empty grid wrappers are ignored.
    const contentEls = [];
    const elements = panel.querySelector('.cmp-contentfragment__elements') || panel;
    Array.from(
      elements.querySelectorAll('p, ul, ol, img.cmp-image__image, .cmp-image img'),
    ).forEach((el) => {
      // Skip images already contained within a captured paragraph/list.
      if (el.tagName === 'IMG' && el.closest('p, ul, ol')) return;
      const text = el.textContent && el.textContent.trim();
      if (el.tagName === 'IMG' || text) contentEls.push(el);
    });

    cells.push([label, contentEls.length ? contentEls : '']);
  });

  // Empty-block guard: no tabs found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'tabs (minimal-dark-withimg)',
    cells,
  });
  element.replaceWith(block);
}
