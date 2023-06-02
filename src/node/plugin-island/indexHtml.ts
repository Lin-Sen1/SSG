import { readFile } from 'fs/promises';
import { Plugin } from 'vite';
import { CLIENT_ENTRY_PATH, DEFAULT_HTML_PATH } from '../constants';

// 通过vite插件来相应 template.html文件

export function pluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    apply: 'serve' /* apply属性指明在'build'或者'serve'模式时调用 ，支持函数 */,
    // 插入入口 script 标签
    // 转换 index.html 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文。上下文在开发期间暴露ViteDevServer实例，在构建期间暴露 Rollup 输出的包。
    // 同样可以使用genTemplate.ts去生成入口文件
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              // 通过vite插件来相应 template.html文件
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: 'body'
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        // 关于middlewares => https://github.com/senchalabs/connect#use-middleware
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, 'utf-8'); //此处就是template.html

          try {
            //  transformIndexHtml 应用 Vite 内建 HTML 转换和任意插件 HTML 转换
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}
