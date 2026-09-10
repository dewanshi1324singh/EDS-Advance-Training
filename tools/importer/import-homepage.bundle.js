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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-minimal-dark-withimg.js
  function parse(element, { document: document2 }) {
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
      name: "carousel (minimal-dark-withimg)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-minimal-dark-withimg.js
  function parse2(element, { document: document2 }) {
    const byline = element.querySelector(".cmp-byline");
    const authorCell = [];
    if (byline) {
      const photo = byline.querySelector("img.cmp-image__image, .cmp-byline__image img, img");
      const name = byline.querySelector(".cmp-byline__name, h1, h2, h3");
      const occupation = byline.querySelector(".cmp-byline__occupations, p");
      if (photo) authorCell.push(photo);
      if (name) authorCell.push(name);
      if (occupation) authorCell.push(occupation);
    }
    const socialLinks = Array.from(
      element.querySelectorAll(".cmp-buildingblock--btn-list a.cmp-button, .buildingblock a.cmp-button, a.cmp-button")
    );
    if (!authorCell.length && !socialLinks.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([
      authorCell.length ? authorCell : "",
      socialLinks.length ? socialLinks : ""
    ]);
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "columns (minimal-dark-withimg)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-minimal-dark-withimg.js
  function parse3(element, { document: document2 }) {
    const items = Array.from(
      element.querySelectorAll(".cmp-image-list__item")
    );
    const cells = [];
    items.forEach((item) => {
      var _a;
      const img = item.querySelector(
        ".cmp-image-list__item-image-link img, .cmp-image img, img"
      );
      const titleLink = item.querySelector('.cmp-image-list__item-title-link, a[class*="title"]');
      const titleText = item.querySelector(".cmp-image-list__item-title");
      const description = item.querySelector(
        '.cmp-image-list__item-description, [class*="description"]'
      );
      if (!img && !titleLink && !titleText) return;
      const bodyCell = [];
      const label = (_a = titleText || titleLink) == null ? void 0 : _a.textContent.trim();
      if (label) {
        const heading = document2.createElement("h3");
        const href = titleLink == null ? void 0 : titleLink.getAttribute("href");
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = label;
          heading.append(a);
        } else {
          heading.textContent = label;
        }
        bodyCell.push(heading);
      }
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        bodyCell.push(p);
      }
      cells.push([img || "", bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards (minimal-dark-withimg)",
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

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-minimal-dark-withimg": parse,
    "columns-minimal-dark-withimg": parse2,
    "cards-minimal-dark-withimg": parse3
  };
  var PAGE_TEMPLATE = {
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
