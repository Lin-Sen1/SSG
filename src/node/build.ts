import { build as viteBuild, InlineConfig } from 'vite';
import type { RollupOutput } from 'rollup';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import path, { dirname } from 'path';
import fs from 'fs-extra';
import ora from 'ora';

import { SiteConfig } from '../shared/types/index';

import { pathToFileURL } from 'url';
import { createVitePlugins } from './vitePlugins';
import { Route } from './plugin-routes/index';

// 此处当时以为和定义一个function是一个意思，但是会报错
// 原因是因为function最后return的还是import语法，最后打包的时候会被编译为require导致报错
// new Funciton语法是在编译的时候使用的，接受的是字符串，所以编译的时候不会被识别为import语法
// 最后会被正常编译为import
// const dynamicImport = new Function("m", "return import(m)");

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (
    isServer: boolean
  ): Promise<InlineConfig> => {
    return {
      mode: 'production',
      root,
      plugins: await createVitePlugins(config, isServer),
      ssr: {
        // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物
        noExternal: ['react-router-dom', 'lodash-es']
      },
      build: {
        minify: false,
        ssr: isServer,
        outDir: isServer ? path.join(root, '.temp') : path.join(root, 'build'),
        rollupOptions: {
          // input是入口文件，output是出口文件
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: isServer ? 'cjs' : 'esm'
          }
        }
      }
    };
  };
  // // const { default: ora } = await dynamicImport("ora");
  console.log('Building client + server bundles...');
  // // 可能会造成阻塞，下方会写出优化写法
  // // await clientBuild();
  // // await serverBuild();
  // // 使用Promise.all()同步执行
  // // const [clientBundle, serverBundle] = await Promise.all([
  //   // client build
  // //  clientBuild(),
  //   // server build
  // //  serverBuild()
  // // ]);

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(await resolveViteConfig(false)),
      viteBuild(await resolveViteConfig(true))
    ]);
    // 断言return类型，防止用的时候类型错误
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.log('1---------------------', error);
  }
}

// renderPage用来渲染多路由页面
export async function renderPage(
  render: (url: string) => string,
  root: string,
  clientBundle: RollupOutput,
  routes: Route[]
) {
  // 在客户端打包产物中找到type为chunk并且isEntry为true的对象，用于下方插入js脚本。
  console.log('Rendering page in server side...');
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  // 多路由打包
  // 1. 遍历路由数组
  // 2. 拿到每个路由的path
  // 3. 调用render函数，拿到组件的html字符串
  // 4. 拼接html字符串
  // 5. 写入文件
  // 6. 重复1-5
  // 7. 打包结束
  await Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      // 调用render函数，拿到组件的html字符串
      const appHtml = await render(routePath);
      const html = `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSG</title>
</head>

<body>
  <div id="root">${appHtml}</div>
  <script type="module" src="/${clientChunk.fileName}"></script>
</body>

</html>
  `.trim();

      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`;
      // 安装fs-extra 这个库比原生的fs库有更加好用的API，暂时是啥API
      // ensureDir 如果目录结构不存在，则创建它，如果目录存在，则不进行创建，类似mkdir -p。
      await fs.ensureDir(path.join(root, 'build', dirname(fileName)));
      // 把html产物写入到文件目录中
      await fs.writeFile(path.join(root, 'build', fileName), html);
    })
  );
  // 移除ssr产物
  // await fs.remove(path.join(root, '.temp'));
}

export async function build(root: string, config: SiteConfig) {
  // 1 需要打包 生成两份打包产物，分别跑在client端和server端
  const [clientBundle] = await bundle(root, config);
  // 2 引入server-entry 模块
  // 使用path.join()找不到路径，使用resolve后正常，原因是join只是将简单的路劲片段进行拼接
  // 并规范化生成一个路径，而resolve生成绝对路径，相当于执行cd操作
  const serverEntryPath = path.resolve(root, '.temp', 'ssr-entry.js');
  // 3 服务端渲染，产出HTML
  // 此处虽然可以直接引用runtime中的render，但是不推荐，因为ssr-entry本质是跑在node环境里。
  const { render, routes } = await import(serverEntryPath);
  try {
    await renderPage(render, root, clientBundle, routes);
  } catch (error) {
    console.log('renderPage报错咯---------------', error);
  }
}
