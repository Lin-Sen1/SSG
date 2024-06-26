import cac from 'cac';
import { resolve } from 'path';
// import { generateHtmlFn } from "./genTemplate";

import { build } from './build';
import { resolveConfig } from './config';
import { preview } from './preview';

// import { resolve } from "root";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const currentVersion = require('../../package').version;

// 创建cac实例  version 定义版本号 help定义帮助信息
const cli = cac('island').version(currentVersion).help();

cli.command('').action(async () => {
  console.log('---------------island success!---------------');
});

// action 如果输入的命令与之匹配，则使用回调函数作为命令操作
cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  // generateHtmlFn();

  const createServer = async () => {
    // 如果要在 CJS 模块中调用 ESM 模块中的内容，需要使用 await import("路径")，而且必须要有异步（async）环境
    // import { createDevServer } from "./dev";  如果在顶部这样引用，应该是同一个意思
    const { createDevServer } = await import('./dev');

    const server = await createDevServer(root, async () => {
      // 重启 server
      await server.close();
      await createServer();
    });
    // 启动 server
    await server.listen();
    // 打印 server 的地址信息
    server.printUrls();
  };

  // 在cli的命令中启动server
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
      console.log('build error------------------', error);
    }
  });

cli
  .command('preview [root]', 'preview production build')
  .option('--port <port>', 'port to use for preview server')
  .action(async (root: string, { port }: { port: number }) => {
    try {
      root = resolve(root);
      await preview(root, { port });
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
