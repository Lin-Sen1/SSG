import { build as viteBuild, InlineConfig } from "vite";
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from "./constants";
import type { RollupOutput } from "rollup";
import path = require("path");
import * as fs from "fs-extra";

export async function bundle(root: string) {
  try {
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: "production",
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? ".temp" : "build",
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm",
            },
          },
        },
      };
    };

    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };

    console.log("Building client + server bundles...");
    // 可能会造成阻塞，下方会写出优化写法
    // await clientBuild();
    // await serverBuild();
    // 使用Promise.all()同步执行
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild(),
    ]);
    return [clientBundle, serverBundle];
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
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
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
  // 将js产物放入scrpit中
  <script type="module" src="/${clientChunk.fileName}"></script>
</body>

</html>
  `.trim();
  // 把html产物写入到文件目录中
  // 安装fs-extra 这个库比原生的fs库有更加好用的API，暂时是啥API
  await fs.writeFile(path.join(root, "build", "index.html"), html);
  // 移除ssr产物
  await fs.remove(path.join(root, ".temp"));
}

export async function build(root: string) {
  // 1 需要打包 生成两份打包产物，分别跑在client端和server端
  const [clientBundle] = await bundle(root);
  // 2 引入server-entry 模块
  // 使用path.join()找不到路径，使用resolve后正常，原因是join只是将简单的路劲片段进行拼接
  // 并规范化生成一个路径，而resolve生成绝对路径，相当于执行cd操作
  const serverEntryPath = path.resolve(root, ".temp", "ssr-entry.js");
  // 3 服务端渲染，产出HTML
  const { render } = require(serverEntryPath);
  await renderPage(render, root, clientBundle);
}
