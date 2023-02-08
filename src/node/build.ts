import { build as viteBuild, InlineConfig } from 'vite';
import type { RollupOutput } from 'rollup';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';

import { pluginConfig } from './plugin-island/config';
import { SiteConfig } from '../shared/types/index';
import pluginReact from '@vitejs/plugin-react';

import { pathToFileURL } from 'url';

// 此处当时以为和定义一个function是一个意思，但是会报错
// 原因是因为function最后return的还是import语法，最后打包的时候会被编译为require导致报错
// new Funciton语法是在编译的时候使用的，接受的是字符串，所以编译的时候不会被识别为import语法
// 最后会被正常编译为import
// const dynamicImport = new Function("m", "return import(m)");

export async function bundle(root: string, config: SiteConfig) {
  try {
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        plugins: [pluginReact(), pluginConfig(config)],
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ['react-router-dom']
        },
        build: {
          ssr: isServer,
          outDir: isServer ? path.join(root, '.temp') : 'build',
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      };
    };

    // const clientBuild = async () => {
    //   return viteBuild(resolveViteConfig(false));
    // };

    // const serverBuild = async () => {
    //   return viteBuild(resolveViteConfig(true));
    // };

    // // const { default: ora } = await dynamicImport("ora");
    const spinner = ora();
    spinner.start('Building client + server bundles...');
    // // 可能会造成阻塞，下方会写出优化写法
    // // await clientBuild();
    // // await serverBuild();
    // // 使用Promise.all()同步执行
    // const [clientBundle, serverBundle] = await Promise.all([
    //   // client build
    //   clientBuild(),
    //   // server build
    //   serverBuild()
    // ]);

    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ]);

    spinner.stop();
    // 断言return类型，防止用的时候类型错误
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.log(error);
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  // 调用render函数，拿到组件的html字符串
  const appHtml = render();
  // 在客户端打包产物中找到type为chunk并且isEntry为true的对象，用于下方插入js脚本。
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
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
  // 安装fs-extra 这个库比原生的fs库有更加好用的API，暂时是啥API
  // ensureDir 如果目录结构不存在，则创建它，如果目录存在，则不进行创建，类似mkdir -p。
  await fs.ensureDir(path.join(root, 'build'));
  // 把html产物写入到文件目录中
  await fs.writeFile(path.join(root, 'build', 'index.html'), html);
  // 移除ssr产物
  await fs.remove(path.join(root, '.temp'));
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
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  try {
    await renderPage(render, root, clientBundle);
  } catch (error) {
    console.log('buildError---------------', error);
  }
}
