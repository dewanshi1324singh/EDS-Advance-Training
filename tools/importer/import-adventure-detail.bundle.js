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

  // tools/importer/import-adventure-detail.js
  var import_adventure_detail_exports = {};
  __export(import_adventure_detail_exports, {
    default: () => import_adventure_detail_default
  });

  // tools/importer/parsers/breadcrumbs-minimal-dark.js
  function parse(element, { document: document2 }) {
    const items = Array.from(
      element.querySelectorAll(".cmp-breadcrumb__item, li")
    );
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a");
      if (link) {
        const span = link.querySelector("span");
        if (span) link.textContent = span.textContent.trim();
        cells.push([link]);
      } else {
        const text = item.textContent.trim();
        if (text) cells.push([text]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "breadcrumbs-minimal-dark",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-minimal-dark-withimg.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(
      element.querySelectorAll(".cmp-carousel__item")
    );
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img.cmp-image__image, .cmp-image img, img");
      if (!img) return;
      const contentEls = Array.from(
        item.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a.cta, a.button")
      );
      cells.push([img, contentEls.length ? contentEls : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "carousel-minimal-dark-withimg",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-minimal-dark-withimg.js
  function parse3(element, { document: document2 }) {
    const tabs = Array.from(element.querySelectorAll(".cmp-tabs__tab"));
    const panels = Array.from(element.querySelectorAll(".cmp-tabs__tabpanel"));
    const cells = [];
    tabs.forEach((tab, i) => {
      const label = tab.textContent.trim();
      const panel = panels[i];
      if (!label || !panel) return;
      const contentEls = [];
      const elements = panel.querySelector(".cmp-contentfragment__elements") || panel;
      Array.from(
        elements.querySelectorAll("p, ul, ol, img.cmp-image__image, .cmp-image img")
      ).forEach((el) => {
        if (el.tagName === "IMG" && el.closest("p, ul, ol")) return;
        const text = el.textContent && el.textContent.trim();
        if (el.tagName === "IMG" || text) contentEls.push(el);
      });
      cells.push([label, contentEls.length ? contentEls : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "tabs-minimal-dark-withimg",
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

  // tools/importer/import-adventure-detail.js
  var parsers = {
    "breadcrumbs-minimal-dark": parse,
    "carousel-minimal-dark-withimg": parse2,
    "tabs-minimal-dark-withimg": parse3
  };
  var PAGE_TEMPLATE = {
    name: "adventure-detail",
    description: "Detail page with breadcrumb, full-width image carousel hero, a left metadata sidebar of label/value pairs, and a tabbed main content area with body copy and inline images.",
    urls: [
      "https://wknd.site/ca/en/adventures/bali-surf-camp.html"
    ],
    blocks: [
      {
        name: "breadcrumbs-minimal-dark",
        instances: [".breadcrumb.cmp-breadcrumb--fixed", ".breadcrumb"]
      },
      {
        name: "carousel-minimal-dark-withimg",
        instances: [".carousel.cmp-carousel--mini", ".carousel.panelcontainer"]
      },
      {
        name: "tabs-minimal-dark-withimg",
        instances: [".tabs.panelcontainer", ".tabs .cmp-tabs"]
      }
    ],
    sections: [
      {
        id: "s1",
        name: "Breadcrumb",
        selector: [".breadcrumb.cmp-breadcrumb--fixed", ".breadcrumb"],
        style: null,
        blocks: ["breadcrumbs-minimal-dark"],
        defaultContent: []
      },
      {
        id: "s2",
        name: "Hero image carousel",
        selector: [".carousel.cmp-carousel--mini", ".carousel.panelcontainer"],
        style: null,
        blocks: ["carousel-minimal-dark-withimg"],
        defaultContent: []
      },
      {
        id: "s3",
        name: "Page title",
        selector: [".title.cmp-title--underline", ".title"],
        style: null,
        blocks: [],
        defaultContent: [".title.cmp-title--underline", ".cmp-title__text"]
      },
      {
        id: "s4",
        name: "Adventure metadata sidebar",
        selector: [".aem-GridColumn--default--3"],
        style: null,
        blocks: [],
        defaultContent: [".aem-GridColumn--default--3"]
      },
      {
        id: "s5",
        name: "Tabbed main content",
        selector: [".tabs.panelcontainer", ".tabs"],
        style: null,
        blocks: ["tabs-minimal-dark-withimg"],
        defaultContent: []
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
          matched = {
            name: blockDef.name,
            selector,
            element: el,
            section: blockDef.section || null
          };
          break;
        }
      }
      if (matched) pageBlocks.push(matched);
      else console.warn(`Block "${blockDef.name}" not found with any selector: ${blockDef.instances.join(", ")}`);
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_adventure_detail_default = {
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
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_adventure_detail_exports);
})();
