/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsMinimalDarkWithimg2Parser from './parsers/cards-minimal-dark-withimg-2.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'cards-minimal-dark-withimg-2': cardsMinimalDarkWithimg2Parser,
};

const PAGE_TEMPLATE = {
  "name": "profile-directory",
  "description": "Content page with a page title followed by multiple underlined section headings, each introducing a grid of circular-image profile cards with name, role, and social icons.",
  "urls": [
    "https://wknd.site/ca/en/about-us.html"
  ],
  "blocks": [
    {
      "name": "cards-minimal-dark-withimg-2",
      "instances": [
        ".cmp-layout-container--fixed .cmp-container",
        ".aem-Grid:has(.cmp-experience-fragment--contributor)"
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
      "name": "Our Contributors heading + intro",
      "selector": [
        ".cmp-title",
        ".title"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".text",
        ".title"
      ]
    },
    {
      "id": "s3",
      "name": "Contributors profile-card grid",
      "selector": [
        ".cmp-layout-container--fixed .cmp-container"
      ],
      "style": null,
      "blocks": [
        "cards-minimal-dark-withimg-2"
      ],
      "defaultContent": []
    },
    {
      "id": "s4",
      "name": "WKND Guides heading + intro",
      "selector": [
        ".cmp-title",
        ".title"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".text"
      ]
    },
    {
      "id": "s5",
      "name": "Guides profile-card grid",
      "selector": [
        ".cmp-layout-container--fixed .cmp-container"
      ],
      "style": null,
      "blocks": [
        "cards-minimal-dark-withimg-2"
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
