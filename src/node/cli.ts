import cac from 'cac';
import { resolve } from 'path';
// import { generateHtmlFn } from "./genTemplate";

import { build } from './build';
import { resolveConfig } from './config';
// import { resolve } from "root";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const currentVersion = require('../../package').version;

// 创建cac实例  version 定义版本号 help定义帮助信息
const cli = cac('island').version(currentVersion).help();

// action 如果输入的命令与之匹配，则使用回调函数作为命令操作
cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  // generateHtmlFn();

  // ----------------------test-------------------------

  const createServer = async () => {
    // 如果要在 CJS 模块中调用 ESM 模块中的内容，需要使用 await import("路径")，而且必须要有异步（async）环境
    const { createDevServer } = await import('./dev.js');
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };

  await createServer();
});

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    try {
      root = resolve(root);
      const config = await resolveConfig(root, 'build', 'production');
      await build(root, config);
    } catch (error) {
      console.log('error------------------', error);
    }
  });

cli.parse();
