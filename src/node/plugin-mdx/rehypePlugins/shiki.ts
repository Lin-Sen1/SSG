import type { Root, Text } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
// 完成代码高亮的插件
import shiki from 'shiki';

interface Options {
  highlighter: shiki.Highlighter;
}

// 配置 mdx code 部分高亮
export const rehypePluginShiki: Plugin<[Options], Root> = ({ highlighter }) => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      //
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0]?.tagName === 'code'
      ) {
        // 接下来需要获取 『语法名称』 和 『代码内容』
        // 代码内容
        const codeNode = node.children[0];
        const codeContent = (codeNode.children[0] as Text).value;
        // 语法名称
        const codeClassName = codeNode.properties?.className?.toString() || '';
        // 返回格式为 language-js 格式，需要截取到语法名称
        const lang = codeClassName.split('-')[1];
        // 没有语法信息 直接return
        if (!lang) return;

        // 高亮结果
        const hightlightedCode = highlighter.codeToHtml(codeContent, { lang });
        // 注意！我们需要将其转换为 AST 然后进行插入
        const fragmentAst = fromHtml(hightlightedCode, { fragment: true });
        parent.children.splice(index, 1, ...fragmentAst.children);
      }
    });
  };
};
