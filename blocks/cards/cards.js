import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);

  /* Profile-card variant: turn the stacked social text links into a row of
     dark icon squares (matches WKND contributor cards). */
  if (block.classList.contains('minimal-dark-withimg-2')) {
    const socialIcons = {
      facebook: '/content/images/social-facebook.svg',
      twitter: '/content/images/social-twitter.svg',
      instagram: '/content/images/social-instagram.svg',
    };
    ul.querySelectorAll('.cards-card-body').forEach((body) => {
      const socialLinks = [...body.querySelectorAll('p > a')];
      if (!socialLinks.length) return;
      const nav = document.createElement('div');
      nav.className = 'cards-social';
      socialLinks.forEach((a) => {
        const wrapper = a.closest('p');
        const label = (a.textContent || '').trim();
        const key = Object.keys(socialIcons).find((k) => label.toLowerCase().includes(k));
        a.setAttribute('aria-label', label);
        a.textContent = '';
        const img = document.createElement('img');
        img.src = key ? socialIcons[key] : socialIcons.facebook;
        img.alt = '';
        img.loading = 'lazy';
        img.width = 20;
        img.height = 20;
        a.append(img);
        nav.append(a);
        if (wrapper) wrapper.remove();
      });
      body.append(nav);
    });
  }
}
