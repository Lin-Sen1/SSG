import pluginMdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
// GFM 全称为 GitHub flavored markdown，是一个比较知名的 Markdown 语法规范，使用也比较广泛
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';

import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontmatter from 'remark-frontmatter';

export function pluginMdxRollup() {
  return [
    pluginMdx({
      remarkPlugins: [
        remarkGfm,
        remarkPluginFrontmatter,
        [remarkPluginMDXFrontMatter, { name: 'frontMatter' }]
      ],
      rehypePlugins: [
        rehypePluginSlug,
        [
          rehypePluginAutolinkHeadings,
          {
            properties: {
              class: 'header-anchor'
            },
            content: {
              type: 'text',
              value: '#'
            }
          }
        ]
      ]
    })
  ];
}
