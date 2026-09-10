import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Author Profile block — writer/photographer details.
 * Author contract (single block, one row):
 *   | author-profile |
 *   | <avatar image> | Name (heading) + Title/role (text) [+ optional social links] |
 * Or two rows: row 1 = avatar, row 2 = name + title. Decorate defensively so
 * either shape renders. An optional trailing paragraph of links becomes a small
 * social row.
 */
export default function decorate(block) {
  // Collect the image (avatar) and the text content wherever they sit.
  const img = block.querySelector('picture img, img');
  const headings = [...block.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  const name = headings[0] || null;
  // role/title = first paragraph that isn't purely a link
  const paras = [...block.querySelectorAll('p')];
  const title = paras.find((p) => !p.querySelector('a')) || null;
  const links = [...block.querySelectorAll('a[href]')];

  const card = document.createElement('div');
  card.className = 'author-profile-card';

  // avatar
  if (img) {
    const avatar = document.createElement('div');
    avatar.className = 'author-profile-avatar';
    const pic = createOptimizedPicture(img.src, img.alt || (name?.textContent ?? 'Author'), false, [{ width: '300' }]);
    avatar.append(pic);
    card.append(avatar);
  }

  const body = document.createElement('div');
  body.className = 'author-profile-body';
  if (name) {
    name.classList.add('author-profile-name');
    body.append(name);
  }
  if (title) {
    title.classList.add('author-profile-title');
    body.append(title);
  }
  if (links.length) {
    const social = document.createElement('ul');
    social.className = 'author-profile-social';
    links.forEach((a) => {
      const li = document.createElement('li');
      a.setAttribute('rel', 'noopener');
      li.append(a);
      social.append(li);
    });
    body.append(social);
  }
  card.append(body);

  block.replaceChildren(card);
}
