/*
 * Quote block (excat-generated, structural reference: EDS block collection quote).
 * Standalone model: first cell = quotation, optional second cell = attribution.
 * Tolerates an optional leading image cell (image-forward callout variant). Options
 * fold in as CSS classes read from block.classList; advisory and tolerated when absent.
 */

const OPTION_CLASSES = ['minimal-dark-withimg', 'minimal-dark-withimg-1'];

export default async function decorate(block) {
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));
  if (active.length) block.dataset.quoteOptions = active.join(' ');

  const cells = [...block.children].map((c) => c.firstElementChild).filter(Boolean);

  // An optional leading image cell renders as a media element beside/above the quote.
  let image = null;
  if (cells.length && cells[0].querySelector('picture')) {
    image = cells.shift();
    image.className = 'quote-image';
  }

  const [quotation, attribution] = cells;
  const blockquote = document.createElement('blockquote');

  if (quotation) {
    quotation.className = 'quote-quotation';
    blockquote.append(quotation);
  }
  if (attribution) {
    attribution.className = 'quote-attribution';
    blockquote.append(attribution);
    attribution.querySelectorAll('em').forEach((em) => {
      const cite = document.createElement('cite');
      cite.innerHTML = em.innerHTML;
      em.replaceWith(cite);
    });
  }

  block.innerHTML = '';
  if (image) block.append(image);
  block.append(blockquote);
}
