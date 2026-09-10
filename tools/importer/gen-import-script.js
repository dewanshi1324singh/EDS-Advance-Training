/* Helper (excat, local): generate an import-<template>.js from page-templates.json.
 * Usage: node tools/importer/gen-import-script.js <templateName>
 * Emits tools/importer/import-<templateName>.js with the standard transform pipeline.
 * Not part of the shipped site — lives under tools/importer for migration only.
 */
const fs = require('fs');
const path = require('path');

const templateName = process.argv[2];
if (!templateName) {
  console.error('usage: node gen-import-script.js <templateName>');
  process.exit(1);
}

const pt = JSON.parse(fs.readFileSync('tools/importer/page-templates.json', 'utf8'));
const tmpl = pt.templates.find((t) => t.name === templateName);
if (!tmpl) {
  console.error(`template not found: ${templateName}`);
  process.exit(1);
}

// unique block names (exclude section- entries)
const blockNames = [...new Set(
  tmpl.blocks.map((b) => b.name).filter((n) => n && !n.startsWith('section-')),
)];

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const parserImports = blockNames
  .map((n) => `import ${camel(n)}Parser from './parsers/${n}.js';`)
  .join('\n');
const registry = blockNames
  .map((n) => `  '${n}': ${camel(n)}Parser,`)
  .join('\n');

// embed a trimmed template (name, first url, blocks, sections)
const embedded = {
  name: tmpl.name,
  description: tmpl.description || '',
  urls: [tmpl.urls[0]],
  blocks: tmpl.blocks,
  sections: tmpl.sections || [],
};

const script = `/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
${parserImports}

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
${registry}
};

const PAGE_TEMPLATE = ${JSON.stringify(embedded, null, 2)};

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
      console.error(\`Transformer failed at \${hookName}:\`, e);
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
    else console.warn(\`Block "\${blockDef.name}" not found: \${blockDef.instances.join(', ')}\`);
  });
  console.log(\`Found \${pageBlocks.length} block instances on page\`);
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
          console.error(\`Failed to parse \${block.name} (\${block.selector}):\`, e);
        }
      } else {
        console.warn(\`No parser found for block: \${block.name}\`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\\/$/, '')
      .replace(/\\.html?$/, '');
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
`;

const out = path.join('tools/importer', `import-${templateName}.js`);
fs.writeFileSync(out, script);
console.log(`wrote ${out} (${blockNames.length} parsers: ${blockNames.join(', ') || 'none'})`);
