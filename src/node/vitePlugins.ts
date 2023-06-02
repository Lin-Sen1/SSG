import { pluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react'; /* react热更新插件 */
import { pluginConfig } from './plugin-island/config';
import { pluginRoutes } from './plugin-routes';
import { SiteConfig } from '../shared/types/index';
import { createMdxPlugins } from './plugin-mdx';
import { Plugin } from 'vite';
import pluginUnocss from 'unocss/vite';
import unocssOptions from './unocssOptions';

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
      jsxRuntime: 'automatic'
    }),
    // 这个插件的作用是将用户的配置注入到vite的环境变量中
    pluginConfig(config, restart),
    // 这个插件的作用是将用户的路由注入到vite的环境变量中
    pluginRoutes({
      root: config.root,
      isSSR
    }),
    await createMdxPlugins()
  ] as Plugin[];
}
