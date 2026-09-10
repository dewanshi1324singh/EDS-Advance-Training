/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroMinimalDarkWithimg5Parser from './parsers/hero-minimal-dark-withimg-5.js';
import tabsMinimalDarkWithimg4Parser from './parsers/tabs-minimal-dark-withimg-4.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'hero-minimal-dark-withimg-5': heroMinimalDarkWithimg5Parser,
  'tabs-minimal-dark-withimg-4': tabsMinimalDarkWithimg4Parser,
};

const PAGE_TEMPLATE = {
  "name": "listing-page",
  "description": "Category landing page with a page title, a hero banner with overlaid text panel, and a filterable grid of image teaser cards below.",
  "urls": [
    "https://wknd.site/ca/en/adventures.html"
  ],
  "blocks": [
    {
      "name": "hero-minimal-dark-withimg-5",
      "instances": [
        ".teaser.cmp-teaser--hero",
        ".teaser"
      ]
    },
    {
      "name": "tabs-minimal-dark-withimg-4",
      "instances": [
        ".tabs.panelcontainer",
        ".tabs .cmp-tabs"
      ]
    }
  ],
  "sections": [
    {
      "id": "s1",
      "name": "Page title",
      "selector": [
        ".title.cmp-title--underline",
        ".title"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".title.cmp-title--underline"
      ]
    },
    {
      "id": "s2",
      "name": "Hero banner",
      "selector": [
        ".teaser.cmp-teaser--hero",
        ".teaser"
      ],
      "style": null,
      "blocks": [
        "hero-minimal-dark-withimg-5"
      ],
      "defaultContent": []
    },
    {
      "id": "s3",
      "name": "Current Adventures section heading",
      "selector": [
        ".cmp-title:not(.cmp-title--underline)",
        ".title"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".title"
      ]
    },
    {
      "id": "s4",
      "name": "Filterable adventure card grid",
      "selector": [
        ".tabs.panelcontainer",
        ".tabs"
      ],
      "style": null,
      "blocks": [
        "tabs-minimal-dark-withimg-4"
      ],
      "defaultContent": []
    }
  ]
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    let matched = null;
    for (const selector of blockDef.instances) {
      const el = document.querySelector(selector);
      if (el) { matched = { name: blockDef.name, selector, element: el }; break; }
    }
    if (matched) pageBlocks.push(matched);
    else console.warn(`Block "${blockDef.name}" not found: ${blockDef.instances.join(', ')}`);
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const p = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path: p,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
