import { join, relative } from 'path';
import { SiteConfig } from 'shared/types';

import { normalizePath, Plugin } from 'vite';
import { PACKAGE_ROOT } from '../constants/index';

const SITE_DATA_ID = 'island:site-data';

export function pluginConfig(
  config: SiteConfig,
  restart?: () => Promise<void>
): Plugin {
  // const server: ViteDevServer | null = null;
  return {
    name: 'island:site-data',
    // 当我们通过import语句来引入island：site-data模块时，会先进入resolveId方法
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        // 返回一个虚拟模块的标识
        // 虚拟模块最前边会带上 `\0` ,这是一个约定
        return '\0' + SITE_DATA_ID;
      }
    },
    // 加载虚拟模块
    // 这段代码会将 config.siteData 对象序列化为 JSON 字符串，并作为模块的默认导出值。
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },

    // 赋值给server
    // configureServer(s) {
    //   server = s;
    // },

    // config 钩子可以让我们自定义 Vite 配置，因此之前指定的 root 参数也可以放到这个钩子中
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
          }
        }
        // css: {
        //   modules: {
        //     localsConvention: 'camelCaseOnly'
        //   }
        // }
      };
    },

    // 配置文件热更新
    // ctx 包含了当前文件的路径
    async handleHotUpdate(ctx) {
      // 监听需要改变的文件 例如：D:/SSG/docs/config.ts
      const customWatchedFiles = [normalizePath(config.configPath)];
      // 判断id是否在监听范围内
      const inculde = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      // 如果变动的文件命中监听数组，执行更新逻辑
      if (inculde(ctx.file)) {
        console.info(
          `\n${relative(config.root, ctx.file)} changed, restarting server ...`
        );
        // 重启 server
        // 方案讨论
        // 1.插件内重启 vite 的 dev server
        // await server.restart();
        // ❌没用作用，因为这个restart只是重启了vite的服务，并没有重新执行 island 配置文件读取的操作
        // 也就是说没有执行
        // 2.手动调用 dev.ts 中的 createServer
        // restart ( cli.ts中的 createDevServer 的回调函数 ) 实质就是在关闭当前服务，再重新开始当前服务，已完成配置文件的热更新
        await restart();
      }
    }
  };
}
