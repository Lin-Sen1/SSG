import { Plugin } from 'vite';
import { RouteService } from './RouteService';

export interface Route {
  path: string;
  element: React.ReactElement;
  filePath: string;
}

interface PluginOptions {
  root: string;
  isSSR: boolean;
}

export const CONVENTIONAL_ROUTE_ID = 'island:routes';

export function pluginRoutes(options: PluginOptions): Plugin {
  // 参数 options.root （需要扫描的路径即 scanDir ）
  const routerService = new RouteService(options.root);

  return {
    name: 'island:routes',

    // 在解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。
    async configResolved() {
      await routerService.init();
    },

    // 当我们通过import语句来引入island：routes模块时，会先进入resolveId方法
    resolveId(id: string) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        // 返回一个虚拟模块的标识
        // 虚拟模块最前边会带上 `\0` ,这是一个约定
        return '\0' + id;
      }
    },
    // 加载虚拟模块
    load(id: string) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return routerService.generateRoutesCode(options.isSSR || false);
      }
    }
  };
}
