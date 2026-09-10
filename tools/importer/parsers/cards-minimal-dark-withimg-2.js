/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-minimal-dark-withimg-2.
 * Base block: cards (with images). 2 columns; first row = block name, each subsequent
 * row is one contributor card: cell 1 = profile image (picture/img), cell 2 = name
 * (heading) + role/occupation + social links stacked.
 * The base cards.js decorate() assigns .cards-card-image to the image cell and
 * .cards-card-body to the content cell per row.
 * Source: https://wknd.site/ca/en/about-us.html
 * Selectors validated against migration-work/block-context/cards-minimal-dark-withimg-2/source.html
 */
export default function parse(element, { document }) {
  // Each contributor experience fragment is one card.
  const items = Array.from(
    element.querySelectorAll('.cmp-experience-fragment--contributor'),
  );

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img.cmp-image__image, .cmp-image img, img');

    // Name (first title / heading) and role (second title / heading) inside the card.
    const headings = Array.from(
      item.querySelectorAll('.cmp-title__text, h1, h2, h3, h4, h5, h6'),
    );
    const name = headings[0] || null;
    const role = headings[1] || null;

    // Social links (Facebook / Twitter / Instagram).
    const socialLinks = Array.from(
      item.querySelectorAll('a.cmp-button, .cmp-buildingblock--btn-list a, a'),
    );

    // Essential content guard for this card.
    if (!img && !name) return;

    const bodyCell = [];
    if (name) {
      const nameHeading = document.createElement('h3');
      nameHeading.textContent = name.textContent.trim();
      bodyCell.push(nameHeading);
    }
    if (role) {
      const roleP = document.createElement('p');
      roleP.textContent = role.textContent.trim();
      bodyCell.push(roleP);
    }
    socialLinks.forEach((a) => {
      const href = a.getAttribute('href') || '#';
      const label = a.textContent.trim() || 'Link';
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = label;
      // Wrap each link in its own paragraph so adjacent same-href links are not
      // merged into a single anchor by the markdown serializer.
      const linkP = document.createElement('p');
      linkP.append(link);
      bodyCell.push(linkP);
    });

    cells.push([img || '', bodyCell]);
  });

  // Empty-block guard: no contributor cards found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards (minimal-dark-withimg-2)',
    cells,
  });
  element.replaceWith(block);
}
