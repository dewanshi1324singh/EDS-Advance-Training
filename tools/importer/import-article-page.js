/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroMinimalDarkWithimg2Parser from './parsers/hero-minimal-dark-withimg-2.js';
import breadcrumbsMinimalDarkParser from './parsers/breadcrumbs-minimal-dark.js';
import columnsMinimalDarkWithimgParser from './parsers/columns-minimal-dark-withimg.js';
import cardsMinimalDarkParser from './parsers/cards-minimal-dark.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-minimal-dark-withimg-2': heroMinimalDarkWithimg2Parser,
  'breadcrumbs-minimal-dark': breadcrumbsMinimalDarkParser,
  'columns-minimal-dark-withimg': columnsMinimalDarkWithimgParser,
  'cards-minimal-dark': cardsMinimalDarkParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'article-page',
  description: 'Long-form magazine article: full-width image hero, title and byline, two-column body with subheadings and inline images plus a related-stories sidebar, and an author footer.',
  urls: [
    'https://wknd.site/ca/en/magazine/arctic-surfing.html',
  ],
  blocks: [
    { name: 'hero-minimal-dark-withimg-2', instances: ['.cmp-layout-container--fixed .image.aem-GridColumn--default--12', '.image.aem-GridColumn--default--12'] },
    { name: 'breadcrumbs-minimal-dark', instances: ['.breadcrumb.aem-GridColumn', '.breadcrumb'] },
    { name: 'columns-minimal-dark-withimg', instances: ['.experiencefragment:not(.aem-GridColumn) .cmp-experiencefragment', '.cmp-experiencefragment--jacob-wester'] },
    { name: 'cards-minimal-dark', instances: ['aside.cmp-layoutcontainer--sidebar .cmp-container', 'aside[class*=sidebar] .cmp-container'] },
  ],
  sections: [
    { id: 's1', name: 'Hero image', selector: ['.cmp-layout-container--fixed .image.aem-GridColumn--default--12', '.image.aem-GridColumn--default--12'], style: null, blocks: ['hero-minimal-dark-withimg-2'], defaultContent: [] },
    { id: 's2', name: 'Breadcrumb', selector: ['.breadcrumb.aem-GridColumn', '.breadcrumb'], style: null, blocks: ['breadcrumbs-minimal-dark'], defaultContent: [] },
    { id: 's3', name: 'Article body', selector: ['.aem-GridColumn--default--8 .cmp-container', 'main.aem-GridColumn--default--8'], style: null, blocks: [], defaultContent: ['.aem-GridColumn--default--8 .cmp-container'] },
    { id: 's4', name: 'Author byline footer', selector: ['.experiencefragment:not(.aem-GridColumn) .cmp-experiencefragment', '.cmp-experiencefragment--jacob-wester'], style: null, blocks: ['columns-minimal-dark-withimg'], defaultContent: [] },
    { id: 's5', name: 'Related stories sidebar', selector: ['aside.cmp-layoutcontainer--sidebar', 'aside[class*=sidebar]'], style: null, blocks: ['cards-minimal-dark'], defaultContent: ['aside.cmp-layoutcontainer--sidebar h2, aside.cmp-layoutcontainer--sidebar h3'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, section transformer after (only when 2+ sections)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * Only the FIRST matching selector per block is used (instances[] are fallbacks).
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    let matched = null;
    for (const selector of blockDef.instances) {
      const el = document.querySelector(selector);
      if (el) {
        matched = {
          name: blockDef.name, selector, element: el, section: blockDef.section || null,
        };
        break;
      }
    }
    if (matched) pageBlocks.push(matched);
    else console.warn(`Block "${blockDef.name}" not found with any selector: ${blockDef.instances.join(', ')}`);
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already detached by an earlier parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
