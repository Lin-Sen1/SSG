import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // 默认是 <pre> <code>...</code> </pre>
      // 1.先找到pre元素
      // 筛选出子元素为code的元素
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code' &&
        !node.data?.isVisited
      ) {
        // 取出 code 元素
        const codeNode = node.children[0];
        // 取出代码语法名称
        const codeClassName = codeNode.properties?.className?.toString() || '';
        // 提取语法名称
        // language-js
        const lang = codeClassName.split('-')[1];
        // 已经取出了className,所以这里删掉
        codeNode.properties.className = '';
        // 克隆pre的节点
        const clonedNode: Element = {
          type: 'element',
          tagName: 'pre',
          children: node.children,
          data: {
            isVisited: true
          }
        };

        // 修改原来的 pre 标签 -> div 标签
        node.tagName = 'div';
        node.properties = node.properties || {};
        node.properties.className = codeClassName;
        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'lang'
            },
            children: [
              {
                type: 'text',
                value: lang
              }
            ]
          },
          clonedNode
        ];
      }
    });
  };
};
