import pluginMdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
// GFM 全称为 GitHub flavored markdown，是一个比较知名的 Markdown 语法规范，使用也比较广泛
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';

import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontmatter from 'remark-frontmatter';
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper';

import shiki from 'shiki';
import { rehypePluginShiki } from './rehypePlugins/shiki';
import { remarkPluginToc } from './remarkPlugins/toc';
import type { Plugin } from 'vite';

export async function pluginMdxRollup(): Promise<Plugin> {
  return pluginMdx({
    /**
     * remark 是 Markdown 相关的插件集合，提供了 Markdown 的解析、修改、转换为 HTML 等能力。
     * 目前提供的一些常用插件：
     * remark-parse: 提供解析 Markdown 的能力
     * remark-gfm: 提供 GFM (GitHub flavored markdown) 支持
     * remark-lint: 提供 Markdown 的代码检查能力
     * remark-toc: 提供 Markdown 文档目录生成功能
     * remark-html 提供将 Markdown 编译为 HTML 的能力
     */
    remarkPlugins: [
      remarkGfm,
      remarkPluginFrontmatter,
      // remarkPluginMDXFrontMatter 用于解析 Markdown 中的 frontmatter
      [remarkPluginMDXFrontMatter, { name: 'frontmatter' }],
      remarkPluginToc
    ],
    // rehype 是 HTML 相关的插件集合，提供了 HTML 的格式化、压缩、文档生成等能力
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
      ],
      rehypePluginPreWrapper,
      [
        rehypePluginShiki,
        { highlighter: await shiki.getHighlighter({ theme: 'nord' }) }
      ]
    ]
  }) as unknown as Plugin;
}
