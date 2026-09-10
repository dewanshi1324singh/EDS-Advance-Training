/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import accordionParser from './parsers/accordion.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'accordion': accordionParser,
};

const PAGE_TEMPLATE = {
  "name": "faq-page",
  "description": "Two-column page with a title, lead image and intro text, an accordion of expandable question rows in the main column, and a supporting text panel in the right sidebar.",
  "urls": [
    "https://wknd.site/ca/en/faqs.html"
  ],
  "blocks": [
    {
      "name": "accordion",
      "instances": [
        ".accordion.panelcontainer",
        ".accordion"
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
        ".title.cmp-title--underline",
        ".cmp-title__text"
      ]
    },
    {
      "id": "s2",
      "name": "Lead image",
      "selector": [
        ".image.aem-GridColumn--default--8",
        ".image"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".image"
      ]
    },
    {
      "id": "s3",
      "name": "Intro paragraph",
      "selector": [
        ".text.aem-GridColumn--default--8",
        ".text"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".text"
      ]
    },
    {
      "id": "s4",
      "name": "FAQ accordion",
      "selector": [
        ".accordion.panelcontainer",
        ".accordion"
      ],
      "style": null,
      "blocks": [
        "accordion"
      ],
      "defaultContent": []
    },
    {
      "id": "s5",
      "name": "Need more help sidebar",
      "selector": [
        ".aem-GridColumn--default--3",
        "aside"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".aem-GridColumn--default--3"
      ]
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
