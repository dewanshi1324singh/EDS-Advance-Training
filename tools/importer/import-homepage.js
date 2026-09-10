/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselMinimalDarkWithimgParser from './parsers/carousel-minimal-dark-withimg.js';
import columnsMinimalDarkWithimgParser from './parsers/columns-minimal-dark-withimg.js';
import cardsMinimalDarkWithimgParser from './parsers/cards-minimal-dark-withimg.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'carousel-minimal-dark-withimg': carouselMinimalDarkWithimgParser,
  'columns-minimal-dark-withimg': columnsMinimalDarkWithimgParser,
  'cards-minimal-dark-withimg': cardsMinimalDarkWithimgParser,
};

const PAGE_TEMPLATE = {
  "name": "homepage",
  "description": "Locale landing page with a full-width carousel hero, a featured-article split panel, and multiple horizontal teaser/card grids separated by underlined section headings.",
  "urls": [
    "https://wknd.site/ca/en.html"
  ],
  "blocks": [
    {
      "name": "carousel-minimal-dark-withimg",
      "instances": [
        ".carousel.cmp-carousel--mini",
        ".carousel.panelcontainer",
        ".carousel"
      ]
    },
    {
      "name": "columns-minimal-dark-withimg",
      "instances": [
        ".teaser.cmp-teaser--featured"
      ]
    },
    {
      "name": "cards-minimal-dark-withimg",
      "instances": [
        ".image-list.list",
        ".cmp-image-list"
      ]
    }
  ],
  "sections": [
    {
      "id": "s1",
      "name": "Hero carousel",
      "selector": [
        ".carousel.panelcontainer",
        ".carousel"
      ],
      "style": null,
      "blocks": [
        "carousel-minimal-dark-withimg"
      ],
      "defaultContent": []
    },
    {
      "id": "s2",
      "name": "Featured Article split",
      "selector": [
        ".teaser.cmp-teaser--featured"
      ],
      "style": "grey",
      "blocks": [
        "columns-minimal-dark-withimg"
      ],
      "defaultContent": []
    },
    {
      "id": "s3",
      "name": "Recent Articles teaser grid",
      "selector": [
        ".image-list.list",
        ".cmp-image-list"
      ],
      "style": null,
      "blocks": [
        "cards-minimal-dark-withimg"
      ],
      "defaultContent": [
        ".title"
      ]
    },
    {
      "id": "s4",
      "name": "Next Adventures heading",
      "selector": [
        ".title"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".title"
      ]
    },
    {
      "id": "s5",
      "name": "Climbing New Zealand split",
      "selector": [
        ".teaser.cmp-teaser--hero:not(.carousel .teaser)"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".teaser.cmp-teaser--hero"
      ]
    },
    {
      "id": "s6",
      "name": "Where do you want to go grid",
      "selector": [
        ".image-list.list",
        ".cmp-image-list"
      ],
      "style": null,
      "blocks": [
        "cards-minimal-dark-withimg"
      ],
      "defaultContent": [
        ".title"
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
