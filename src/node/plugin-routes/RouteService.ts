import fastGlob from 'fast-glob';
import path from 'path';
import { normalizePath } from 'vite';

interface RouteMeta {
  // 路由路径
  routePath: string;
  // 文件的绝对路径
  absolutePath: string;
}

// 这里的 RouteService 用于生成约定式路由
export class RouteService {
  // # 表示私有变量

  // scanDir 扫描路径
  #scanDir: string;
  // routeData 路由数据
  #routeData: RouteMeta[] = [];

  // scanDir 扫描路径
  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }

  async init() {
    // 返回 scanDir 目录中包含以下后缀的文件路径
    const files = fastGlob
      // fast-glob 是一个用于快速获取文件路径的工具
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        // 执行的工作目录
        cwd: this.#scanDir,
        // 返回绝对路径
        absolute: true,
        // 需要排除的路径
        ignore: ['**/build/**', '**/.island/**', 'config.ts']
      })
      // 进行排序，保证每次返回的files都是稳定的
      .sort();
    files.forEach((file) => {
      // normalizePath 用于规范化路径
      const fileRelativePath = normalizePath(
        // 根据传入的 this.#scanDir (当前工作目录)
        // 返回从 from 到 to 的相对路径
        // 此时 from = fixtrues
        // 此时 to =  D:/SSG/src/node/plugin-routes/fixtures/a.mdx
        path.relative(this.#scanDir, file)
        // 结果是  a.mdx
      );
      // 使用正则把不规范的路由格式化为正确路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }

  // import loadable from '@loadable/component';
  generateRoutesCode(ssr: boolean) {
    return `
          import React from 'react';
          ${ssr ? '' : 'import loadable from "@loadable/component";'}

          ${this.#routeData
            .map((route, index) => {
              return ssr
                ? `import Route${index} from "${route.absolutePath}";`
                : `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
            })
            .join('\n')}

            export const routes = [
              ${this.#routeData
                .map((route, index) => {
                  return `{ path: '${route.routePath}', element: React.createElement(Route${index}) },`;
                })
                .join('\n')}
              ];
    `;
  }

  getRouteMeta(): RouteMeta[] {
    return this.#routeData;
  }

  // 这个方法用于把文件路径转换成路由路径
  normalizeRoutePath(rawPath: string) {
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }
}
