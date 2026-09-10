/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-minimal-dark-withimg.
 * Base block: carousel (2 columns; first row = block name, each subsequent row is a
 * slide: cell 1 = image (mandatory), cell 2 = optional text content).
 * Source: https://wknd.site/ca/en/adventures/bali-surf-camp.html
 * Selectors validated against migration-work/block-context/carousel-minimal-dark-withimg/source.html
 */
export default function parse(element, { document }) {
  // Each carousel item is one slide.
  const items = Array.from(
    element.querySelectorAll('.cmp-carousel__item'),
  );

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img.cmp-image__image, .cmp-image img, img');
    if (!img) return; // image is mandatory for a slide

    // Optional text content: any heading / paragraph / CTA inside the slide.
    const contentEls = Array.from(
      item.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a.cta, a.button'),
    );

    cells.push([img, contentEls.length ? contentEls : '']);
  });

  // Empty-block guard: no slides with images.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-minimal-dark-withimg',
    cells,
  });
  element.replaceWith(block);
}
