/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-listing-page.js
  var import_listing_page_exports = {};
  __export(import_listing_page_exports, {
    default: () => import_listing_page_default
  });

  // tools/importer/parsers/hero-minimal-dark-withimg-5.js
  function parse(element, { document: document2 }) {
    const image = element.querySelector("img.cmp-image__image, .cmp-teaser__image img, .cmp-image img, img");
    const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    const description = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description, p, [class*="subtitle"]');
    const ctaLinks = Array.from(element.querySelectorAll("a.cmp-teaser__action-link, a.cmp-button, a.cta, a.button"));
    const cells = [];
    if (image) cells.push([image]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    if (contentCell.length) cells.push([contentCell]);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "hero (minimal-dark-withimg-5)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-minimal-dark-withimg-4.js
  function parse2(element, { document: document2 }) {
    const labels = Array.from(element.querySelectorAll(".cmp-tabs__tab")).map((tab) => tab.textContent.trim()).filter(Boolean);
    const allPanel = element.querySelector(".cmp-tabs__tabpanel--active") || element.querySelector(".cmp-tabs__tabpanel");
    const scope = allPanel || element;
    const items = Array.from(scope.querySelectorAll(".cmp-image-list__item"));
    const cells = [];
    if (labels.length) cells.push(labels);
    items.forEach((item) => {
      const image = item.querySelector("img.cmp-image__image, .cmp-image img, img");
      const textCell = [];
      const titleLink = item.querySelector("a.cmp-image-list__item-title-link");
      if (titleLink) {
        const title = titleLink.textContent.trim();
        if (title) {
          const a = document2.createElement("a");
          a.href = titleLink.getAttribute("href") || "";
          a.textContent = title;
          const strong = document2.createElement("strong");
          strong.append(a);
          textCell.push(strong);
        }
      }
      const desc = item.querySelector(".cmp-image-list__item-description");
      const descText = desc && desc.textContent.trim();
      if (descText) {
        const p = document2.createElement("p");
        p.textContent = descText;
        textCell.push(p);
      }
      if (image || textCell.length) {
        cells.push([image || "", textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "tabs-minimal-dark-withimg-4",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#toggleNav",
        "#mobileNav",
        "iframe"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "noscript",
        "link",
        "source"
      ]);
      element.querySelectorAll("meta").forEach((m) => m.remove());
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-listing-page.js
  var parsers = {
    "hero-minimal-dark-withimg-5": parse,
    "tabs-minimal-dark-withimg-4": parse2
  };
  var PAGE_TEMPLATE = {
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
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      let matched = null;
      for (const selector of blockDef.instances) {
        const el = document2.querySelector(selector);
        if (el) {
          matched = { name: blockDef.name, selector, element: el };
          break;
        }
      }
      if (matched) pageBlocks.push(matched);
      else console.warn(`Block "${blockDef.name}" not found: ${blockDef.instances.join(", ")}`);
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_listing_page_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const p = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path: p,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_listing_page_exports);
})();
