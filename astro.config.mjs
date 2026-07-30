// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

const SITE = 'https://breezer.now';

/**
 * Wraps every Markdown table in a horizontally scrollable div.
 *
 * The comparison guides carry three-column tables that are wider than a phone
 * viewport. Without a wrapper the table either forces the whole page to scroll
 * sideways or gets squeezed into unreadable columns. tabindex makes the scroll
 * container reachable by keyboard, which a focusable-less overflow box is not.
 */
function rehypeTableScroll() {
  const wrap = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      wrap(child);
      if (child.type === 'element' && child.tagName === 'table') {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'], tabIndex: 0 },
          children: [child],
        };
      }
      return child;
    });
  };
  return wrap;
}

/**
 * EN lives at the root, DE under /de/ — matching the URLs that are already
 * indexed. `prefixDefaultLocale: false` is what keeps `/` un-prefixed.
 */
export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [mdx()],
  markdown: {
    rehypePlugins: [rehypeTableScroll],
  },
  image: {
    // Screenshots render at ~263px CSS; these cover 1x/2x/3x without shipping the original.
    responsiveStyles: true,
    layout: 'constrained',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
