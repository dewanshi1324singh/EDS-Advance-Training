/*
 * Breadcrumbs block — structural only (excat-generated).
 * Renders an authored list of links as a horizontal breadcrumb trail.
 * Content contract (standalone): each row holds one crumb; a crumb is either a
 * link (intermediate crumb) or plain text (current page). Authors may omit or
 * add rows freely.
 */
export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumbs-list';

  const rows = [...block.children];
  rows.forEach((row, i) => {
    const li = document.createElement('li');
    li.className = 'breadcrumbs-item';

    // Pull the crumb content out of the authored cell(s).
    const cell = row.querySelector('div') || row;
    const link = cell.querySelector('a');
    if (link) {
      li.append(link);
    } else {
      const text = cell.textContent.trim();
      const span = document.createElement('span');
      span.setAttribute('aria-current', 'page');
      span.textContent = text;
      li.append(span);
    }

    // Mark the last crumb as the current page for styling/accessibility.
    if (i === rows.length - 1) li.classList.add('breadcrumbs-current');
    ol.append(li);
  });

  nav.append(ol);
  block.replaceChildren(nav);
}
