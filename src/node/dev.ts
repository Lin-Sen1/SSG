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

import { resolveConfig } from './config';
import { pluginConfig } from './plugin-island/config';
import { pluginRoutes } from './plugin-routes';

// process.cwd() 返回当前工作目录
export async function createDevServer(
  root = process.cwd(),
  restart: () => Promise<void>
) {
  // 执行 island dev docs 时这个 root 为 docs
  // 查看 resolveConfig 解析出的内容
  // resolveConfig 方法的结果为项目的整体配置, 包括  title?: string; description?: string; themeConfig?: ThemeConfig; vite?: ViteConfiguration;
  const config = await resolveConfig(root, 'serve', 'development');
  return createViteDevServer({
    // vite本身是一个静态资源服务器，如果传进来的是docs，那么vite会提前接管静态资源服务
    // 在你访问约定式路由的时候，直接返回文件内容
    // 所以需要讲root设为框架路径，来绕过vite行为，让约定式路由可以正常访问
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restart),
      pluginRoutes({
        root: config.root
      })
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
