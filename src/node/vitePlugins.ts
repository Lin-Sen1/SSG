import { pluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react'; /* react热更新插件 */
import { pluginConfig } from './plugin-island/config';
import { pluginRoutes } from './plugin-routes';
import { SiteConfig } from '../shared/types/index';
import { createMdxPlugins } from './plugin-mdx';
import { Plugin } from 'vite';
import pluginUnocss from 'unocss/vite';
import unocssOptions from './unocssOptions';
import path from 'path';
import { PACKAGE_ROOT } from './constants';
import babelPluginIsland from './babel-plugin-island';

export async function createVitePlugins(
  config: SiteConfig,
  isSSR: boolean,
  restart?: () => Promise<void>
) {
  return [
    pluginUnocss(unocssOptions),
    // pluginIndexHtml 用来生成index.html
    pluginIndexHtml(),
    // react热更新插件
    pluginReact({
      jsxRuntime: 'automatic',
      jsxImportSource: isSSR
        ? path.join(PACKAGE_ROOT, 'src', 'runtime')
        : 'react',
      babel: {
        plugins: [babelPluginIsland]
      }
    }),
    // 把虚拟模块的配置注入到vite的环境变量中 island:siteData
    // restart是用来监听配置文件的变化，如果配置文件发生变化，就会重启vite服务 解析
    pluginConfig(config, restart),
    // 使用虚拟模块的方式来生成约定式路由，文件夹下的所有文件都会被当做路由
    pluginRoutes({
      root: config.root,
      // isSSR是用来判断是否是ssr模式，ssr是服务端渲染，ssr模式下，会把所有的路由都生成静态文件
      isSSR
    }),
    await createMdxPlugins()
  ] as Plugin[];
}
