import { MD_REGEX } from '../constants';
import { Plugin } from 'vite';
import assert from 'assert';

// vite热更新机制
export function pluginMdxHMR(): Plugin {
  let viteReactPlugin: Plugin;
  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',

    // vite插件的生命周期
    configResolved(config) {
      // config.plugins是一个数组，里面包含了所有的插件
      viteReactPlugin = config.plugins.find(
        (plugin) => plugin.name === 'vite:react-babel'
      ) as Plugin;
    },
    async transform(code, id, opts) {
      if (/\.mdx?$/.test(id)) {
        // Inject babel refresh template code by @vitejs/plugin-react
        assert(typeof viteReactPlugin.transform === 'function');
        const result = await viteReactPlugin.transform?.call(
          this,
          code,
          id + '?.jsx',
          opts
        );
        const selfAcceptCode = 'import.meta.hot.accept();';
        if (
          typeof result === 'object' &&
          !result!.code?.includes(selfAcceptCode)
        ) {
          result!.code += selfAcceptCode;
        }
        debugger;
        return result;
      }
    },
    // mdx热更新，这个用来监听mdx文件的变化
    handleHotUpdate(ctx) {
      if (MD_REGEX.test(ctx.file)) {
        ctx.server.ws.send({
          type: 'custom',
          event: 'mdx-changed',
          data: {
            fillpath: ctx.file
          }
        });
      }
    }
  };
}
