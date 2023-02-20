import fastGlob from 'fast-glob';
import path from 'path';
import { normalizePath } from 'vite';

interface RouteMeta {
  // 路由路径
  routePath: string;
  // 文件的绝对路径
  absolutePath: string;
}

export class RouteService {
  // # 表示私有变量
  #scanDir: string;
  #routeData: RouteMeta[] = [];

  // scanDir 扫描路径
  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }

  async init() {
    // 返回 scanDir 目录中包含以下后缀的文件路径
    const files = fastGlob
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
      const fileRelativePath = normalizePath(
        // 根据传入的 this.#scanDir (当前工作目录)
        // 返回从 from 到 to 的相对路径
        // 此时 from = fixtrues
        // 此时 to =  D:/SSG/src/node/plugin-routes/fixtures/a.mdx
        path.relative(this.#scanDir, file)
        // 结果是  a.mdx
      );
      // 路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }

  // import loadable from '@loadable/component';
  generateRoutesCode() {
    return `
          import React from 'react';
          import loadable from '@loadable/component';
          ${this.#routeData
            .map((route, index) => {
              return `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
            })
            .join('\n')}
            export const routes = [
              ${this.#routeData
                .map((route, index) => {
                  return `{ path: '${route.routePath}', element: React.createElement(Route${index}) }`;
                })
                .join(',\n')}
              ];
    `;
  }

  getRouteMeta(): RouteMeta[] {
    return this.#routeData;
  }

  normalizeRoutePath(raw: string) {
    const routePath = raw.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }
}
