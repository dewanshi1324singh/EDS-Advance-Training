import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Article List block (Day 4 dynamic-list pattern).
 * Dynamically lists Magazine articles from the query index.
 *
 * Author contract (all rows optional):
 *   | article-list |
 *   | index  | /magazine/query-index.json |   (default index; falls back to /query-index.json)
 *   | limit  | 12                          |   (max articles to show)
 *   | filter | /us/en/magazine/            |   (path prefix; default: any *magazine* path)
 *
 * Renders each article as a card: image + title (link) + description.
 */

const DEFAULT_INDEX = '/magazine/query-index.json';
const FALLBACK_INDEX = '/query-index.json';

/** Read simple key/value config rows from the block. */
function readConfig(block) {
  const cfg = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const val = cells[1].textContent.trim();
      if (key) cfg[key] = val;
    }
  });
  return cfg;
}

/** Fetch a query-index sheet, tolerating the default→fallback path. */
async function fetchIndex(indexPath) {
  let resp = await fetch(indexPath);
  if (!resp.ok && indexPath !== FALLBACK_INDEX) resp = await fetch(FALLBACK_INDEX);
  if (!resp.ok) return [];
  const json = await resp.json();
  return Array.isArray(json.data) ? json.data : [];
}

/** True when a row looks like a magazine article. */
function isMagazineArticle(row, filterPrefix) {
  const path = row.path || '';
  if (filterPrefix) return path.startsWith(filterPrefix);
  // default heuristic: under a /magazine/ folder but not the section landing itself
  return /\/magazine\/[^/]+/.test(path) && !/\/magazine$/.test(path);
}

export default async function decorate(block) {
  const cfg = readConfig(block);
  const indexPath = cfg.index || DEFAULT_INDEX;
  const limit = cfg.limit ? parseInt(cfg.limit, 10) : 0;
  const filterPrefix = cfg.filter || '';

  block.textContent = '';

  const rows = await fetchIndex(indexPath);
  let articles = rows.filter((r) => isMagazineArticle(r, filterPrefix));

  // newest first when a date is present
  articles.sort((a, b) => {
    const da = Date.parse(a.publisheddate || a.lastModified || 0) || 0;
    const db = Date.parse(b.publisheddate || b.lastModified || 0) || 0;
    return db - da;
  });
  if (limit > 0) articles = articles.slice(0, limit);

  if (!articles.length) {
    block.innerHTML = '<p class="article-list-empty">No articles found.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'article-list-grid';

  articles.forEach((a) => {
    const li = document.createElement('li');
    li.className = 'article-list-card';

    if (a.image) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'article-list-card-image';
      const link = document.createElement('a');
      link.href = a.path;
      link.append(createOptimizedPicture(a.image, a.title || '', false, [{ width: '750' }]));
      imgWrap.append(link);
      li.append(imgWrap);
    }

    const body = document.createElement('div');
    body.className = 'article-list-card-body';
    const h3 = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = a.path;
    titleLink.textContent = a.title || a.path;
    h3.append(titleLink);
    body.append(h3);

    if (a.description) {
      const p = document.createElement('p');
      p.textContent = a.description;
      body.append(p);
    }
    li.append(body);
    ul.append(li);
  });

  block.append(ul);
}
