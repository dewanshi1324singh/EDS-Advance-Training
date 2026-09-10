/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes non-authorable site chrome and malformed markup.
 * All selectors verified against migration-work/cleaned.html
 * (representative page: adventure-detail / Bali Surf Camp).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / off-canvas nav that could interfere with block parsing.
    // Verified in cleaned.html: <div id="toggleNav"> (l.502), <div id="mobileNav"> (l.508),
    // <iframe id="destination_publishing_iframe..."> Adobe ID syncing (l.500).
    WebImporter.DOMUtils.remove(element, [
      '#toggleNav',
      '#mobileNav',
      'iframe',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (header experience fragment with utility bar,
    // language navigation, main nav, site search; footer experience fragment).
    // Verified in cleaned.html: <header class="experiencefragment cmp-experiencefragment--header"> (l.5),
    // <footer class="experiencefragment cmp-experiencefragment--footer"> (l.399).
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'noscript',
      'link',
      'source',
    ]);

    // Malformed empty <meta> tags scattered inside authorable content
    // (breadcrumb items, carousel image, tab images). Verified in cleaned.html
    // at l.172, l.176, l.188, l.302 — not authorable, remove wherever present.
    element.querySelectorAll('meta').forEach((m) => m.remove());
  }
}
