import { relative } from 'path';
import { SiteConfig } from 'shared/types';

import { normalizePath, Plugin, ViteDevServer } from 'vite';

const SITE_DATA_ID = 'island:site-data';

export function pluginConifg(config: SiteConfig): Plugin {
  let server: ViteDevServer | null = null;
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
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },

    // 赋值给server
    configureServer(s) {
      server = s;
    },

    // 配置文件热更新
    async handleHotUpdate(ctx) {
      // 监听需要改变的文件
      const customWatchedFiles = [normalizePath(config.configPath)];
      // 判断id是否在监听范围内
      const inculde = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      // 如果变动的文件命中监听数组，执行更新逻辑
      if (inculde(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server ...`
        );
        // 重启 server
        // 方案讨论
        // 1.插件内重启 vite 的 dev server
        await server.restart();
        // ❌没用作用，因为这个restart只是重启了vite的服务，并没有重新执行 island 配置文件读取的操作
        // 也就是说没有执行
        // TODO: 从这开始继续看,需要解决cls.ts里的内容, 单独打包dev.ts文件
      }
    }
  };
}
