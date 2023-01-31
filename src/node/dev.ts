// dev server 初始化相关逻辑

// Dev Server 本质上是一个开发阶段使用的 HTTP Server，它主要包含如下的作用:
// 对资源进行编译，然后将编译产物返回给浏览器
// 实现模块热更新，在文件改动时能推送更新到浏览器
// 静态资源服务，比如支持访问图片等静态资源

import { createServer as createViteDevServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react'; /* react热更新插件 */
// 告诉vite 根目录下所有的路径都是合法的
import { PACKAGE_ROOT } from './constants/index';

// process.cwd() 返回当前工作目录
export async function createDevServer(root = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
