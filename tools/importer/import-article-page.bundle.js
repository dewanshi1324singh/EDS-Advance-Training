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

  // tools/importer/import-article-page.js
  var import_article_page_exports = {};
  __export(import_article_page_exports, {
    default: () => import_article_page_default
  });

  // tools/importer/parsers/hero-minimal-dark-withimg-2.js
  function parse(element, { document: document2 }) {
    const image = element.querySelector("img.cmp-image__image, .cmp-image img, img");
    const heading = element.querySelector('h1, h2, h3, .cmp-title__text, [class*="title"]');
    const description = element.querySelector('p:not([class*="occupation"]), [class*="subtitle"]');
    const ctaLinks = Array.from(element.querySelectorAll("a.cmp-button, a.cta, a.button"));
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
      name: "hero (minimal-dark-withimg-2)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/breadcrumbs-minimal-dark.js
  function parse2(element, { document: document2 }) {
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
      name: "breadcrumbs (minimal-dark)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-minimal-dark-withimg.js
  function parse3(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-minimal-dark.js
  function parse4(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".cmp-list__item"));
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a.cmp-list__item-link, a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const titleText = (item.querySelector(".cmp-list__item-title") || link).textContent.trim();
      const dateEl = item.querySelector(".cmp-list__item-date");
      if (!titleText) return;
      const cardCell = [];
      const heading = document2.createElement("h3");
      const titleLink = document2.createElement("a");
      titleLink.setAttribute("href", href);
      titleLink.textContent = titleText;
      heading.append(titleLink);
      cardCell.push(heading);
      if (dateEl && dateEl.textContent.trim()) {
        const dateP = document2.createElement("p");
        dateP.textContent = dateEl.textContent.trim();
        cardCell.push(dateP);
      }
      cells.push([cardCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards (minimal-dark)",
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

  // tools/importer/import-article-page.js
  var parsers = {
    "hero-minimal-dark-withimg-2": parse,
    "breadcrumbs-minimal-dark": parse2,
    "columns-minimal-dark-withimg": parse3,
    "cards-minimal-dark": parse4
  };
  var PAGE_TEMPLATE = {
    name: "article-page",
    description: "Long-form magazine article: full-width image hero, title and byline, two-column body with subheadings and inline images plus a related-stories sidebar, and an author footer.",
    urls: [
      "https://wknd.site/ca/en/magazine/arctic-surfing.html"
    ],
    blocks: [
      { name: "hero-minimal-dark-withimg-2", instances: [".cmp-layout-container--fixed .image.aem-GridColumn--default--12", ".image.aem-GridColumn--default--12"] },
      { name: "breadcrumbs-minimal-dark", instances: [".breadcrumb.aem-GridColumn", ".breadcrumb"] },
      { name: "columns-minimal-dark-withimg", instances: [".experiencefragment:not(.aem-GridColumn) .cmp-experiencefragment", ".cmp-experiencefragment--jacob-wester"] },
      { name: "cards-minimal-dark", instances: ["aside.cmp-layoutcontainer--sidebar .cmp-container", "aside[class*=sidebar] .cmp-container"] }
    ],
    sections: [
      { id: "s1", name: "Hero image", selector: [".cmp-layout-container--fixed .image.aem-GridColumn--default--12", ".image.aem-GridColumn--default--12"], style: null, blocks: ["hero-minimal-dark-withimg-2"], defaultContent: [] },
      { id: "s2", name: "Breadcrumb", selector: [".breadcrumb.aem-GridColumn", ".breadcrumb"], style: null, blocks: ["breadcrumbs-minimal-dark"], defaultContent: [] },
      { id: "s3", name: "Article body", selector: [".aem-GridColumn--default--8 .cmp-container", "main.aem-GridColumn--default--8"], style: null, blocks: [], defaultContent: [".aem-GridColumn--default--8 .cmp-container"] },
      { id: "s4", name: "Author byline footer", selector: [".experiencefragment:not(.aem-GridColumn) .cmp-experiencefragment", ".cmp-experiencefragment--jacob-wester"], style: null, blocks: ["columns-minimal-dark-withimg"], defaultContent: [] },
      { id: "s5", name: "Related stories sidebar", selector: ["aside.cmp-layoutcontainer--sidebar", "aside[class*=sidebar]"], style: null, blocks: ["cards-minimal-dark"], defaultContent: ["aside.cmp-layoutcontainer--sidebar h2, aside.cmp-layoutcontainer--sidebar h3"] }
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
  var import_article_page_default = {
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
  return __toCommonJS(import_article_page_exports);
})();
