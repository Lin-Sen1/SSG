import { pluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react'; /* react热更新插件 */
import { pluginConfig } from './plugin-island/config';
import { pluginRoutes } from './plugin-routes';
import { SiteConfig } from '../shared/types/index';
import { createMdxPlugins } from './plugin-mdx';
import { Plugin } from 'vite';
export async function createVitePlugins(
  config: SiteConfig,
  isSSR: boolean,
  restart?: () => Promise<void>
) {
  return [
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic'
    }),
    pluginConfig(config, restart),
    pluginRoutes({
      root: config.root,
      isSSR
    }),
    await createMdxPlugins()
  ] as Plugin[];
}
