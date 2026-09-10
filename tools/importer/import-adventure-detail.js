/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import breadcrumbsMinimalDarkParser from './parsers/breadcrumbs-minimal-dark.js';
import carouselMinimalDarkWithimgParser from './parsers/carousel-minimal-dark-withimg.js';
import tabsMinimalDarkWithimgParser from './parsers/tabs-minimal-dark-withimg.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PARSER REGISTRY
const parsers = {
  'breadcrumbs-minimal-dark': breadcrumbsMinimalDarkParser,
  'carousel-minimal-dark-withimg': carouselMinimalDarkWithimgParser,
  'tabs-minimal-dark-withimg': tabsMinimalDarkWithimgParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'adventure-detail',
  description: 'Detail page with breadcrumb, full-width image carousel hero, a left metadata sidebar of label/value pairs, and a tabbed main content area with body copy and inline images.',
  urls: [
    'https://wknd.site/ca/en/adventures/bali-surf-camp.html',
  ],
  blocks: [
    {
      name: 'breadcrumbs-minimal-dark',
      instances: ['.breadcrumb.cmp-breadcrumb--fixed', '.breadcrumb'],
    },
    {
      name: 'carousel-minimal-dark-withimg',
      instances: ['.carousel.cmp-carousel--mini', '.carousel.panelcontainer'],
    },
    {
      name: 'tabs-minimal-dark-withimg',
      instances: ['.tabs.panelcontainer', '.tabs .cmp-tabs'],
    },
  ],
  sections: [
    {
      id: 's1',
      name: 'Breadcrumb',
      selector: ['.breadcrumb.cmp-breadcrumb--fixed', '.breadcrumb'],
      style: null,
      blocks: ['breadcrumbs-minimal-dark'],
      defaultContent: [],
    },
    {
      id: 's2',
      name: 'Hero image carousel',
      selector: ['.carousel.cmp-carousel--mini', '.carousel.panelcontainer'],
      style: null,
      blocks: ['carousel-minimal-dark-withimg'],
      defaultContent: [],
    },
    {
      id: 's3',
      name: 'Page title',
      selector: ['.title.cmp-title--underline', '.title'],
      style: null,
      blocks: [],
      defaultContent: ['.title.cmp-title--underline', '.cmp-title__text'],
    },
    {
      id: 's4',
      name: 'Adventure metadata sidebar',
      selector: ['.aem-GridColumn--default--3'],
      style: null,
      blocks: [],
      defaultContent: ['.aem-GridColumn--default--3'],
    },
    {
      id: 's5',
      name: 'Tabbed main content',
      selector: ['.tabs.panelcontainer', '.tabs'],
      style: null,
      blocks: ['tabs-minimal-dark-withimg'],
      defaultContent: [],
    },
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
