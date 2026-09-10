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

  // tools/importer/import-faq-page.js
  var import_faq_page_exports = {};
  __export(import_faq_page_exports, {
    default: () => import_faq_page_default
  });

  // tools/importer/parsers/accordion.js
  function parse(element, { document: document2 }) {
    const items = element.querySelectorAll(".cmp-accordion__item");
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(
        ".cmp-accordion__title, .cmp-accordion__button, .cmp-accordion__header"
      );
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const panel = item.querySelector(".cmp-accordion__panel");
      let contentCell = [];
      if (panel) {
        const contentSource = panel.querySelector(".cmp-text") || panel;
        contentCell = Array.from(contentSource.childNodes).filter((node) => {
          if (node.nodeType === 1) return true;
          if (node.nodeType === 3) return node.textContent.trim().length > 0;
          return false;
        });
        if (contentCell.length === 0) {
          contentCell = Array.from(panel.childNodes);
        }
      }
      if (titleText || contentCell.length) {
        cells.push([titleText, contentCell]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion", cells });
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

  // tools/importer/import-faq-page.js
  var parsers = {
    "accordion": parse
  };
  var PAGE_TEMPLATE = {
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
  var import_faq_page_default = {
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
  return __toCommonJS(import_faq_page_exports);
})();
