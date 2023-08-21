import { rehypePluginPreWrapper } from './../plugin-mdx/rehypePlugins/preWrapper';
import { unified } from 'unified';
import { describe, test, expect } from 'vitest';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkPluginToc } from '../plugin-mdx/remarkPlugins/toc';

import remarkMdx from 'remark-mdx';
import remarkStringify from 'remark-stringify';

describe('Markdown compile cases', () => {
  const processor = unified()
    .use(remarkParse)
    .use(rehypeStringify)
    .use(remarkRehype)
    .use(rehypePluginPreWrapper);
  test('Compile title', async () => {
    const mdContent = '# 123';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot('"<h1>123</h1>"');
  });
  test('Compile code', async () => {
    const mdContent = 'I am using `Island.js`';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(
      '"<p>I am using <code>Island.js</code></p>"'
    );
  });
  test('Compile code block', async () => {
    const mdContent = '```js\nconsole.log(123);\n```';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre><code class=\\"language-js\\">console.log(123);
      </code></pre></div>"
    `);
  });

  test('compile TOC', async () => {
    const mdContent = `# h1

    ## h2 \`code\`
    ### h3 [link](https://islandjs.dev)
    #### h4
    ##### h5
    `;
    const remarkProcessor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkPluginToc)
      .use(remarkStringify);

    const result = remarkProcessor.processSync(mdContent);
    expect(
      result.value.toString().replace(mdContent, '')
    ).toMatchInlineSnapshot(`
      "# h1

      ## h2 \`code\`

      ### h3 [link](https://islandjs.dev)

      #### h4

      ##### h5

      export const toc = [
        {
          \\"id\\": \\"h2-code\\",
          \\"text\\": \\"h2 code\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"h3-link\\",
          \\"text\\": \\"h3 link\\",
          \\"depth\\": 3
        },
        {
          \\"id\\": \\"h4\\",
          \\"text\\": \\"h4\\",
          \\"depth\\": 4
        }
      ];

      export const title = 'h1';
      "
    `);
  });
});
