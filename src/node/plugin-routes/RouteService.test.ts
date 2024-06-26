import { RouteService } from './RouteService';
import path from 'path';
import { describe, expect, test } from 'vitest';
import { normalizePath } from 'vite';

describe('RouteService', async () => {
  const testDir = normalizePath(path.join(__dirname, 'fixtures'));
  const routeService = new RouteService(testDir);
  await routeService.init();

  test('conventional route by file structure', async () => {
    const routeMeta = routeService.getRouteMeta().map((item) => {
      return {
        ...item,
        absolutePath: item.absolutePath.replace(testDir, 'TEST_DIR')
      };
    });
    expect(routeMeta).toMatchInlineSnapshot(`
      [
        {
          "absolutePath": "TEST_DIR/a.mdx",
          "routePath": "/a",
        },
        {
          "absolutePath": "TEST_DIR/guide/index.mdx",
          "routePath": "/guide/",
        },
      ]
    `);
  });

  test('generate routes code', async () => {
    expect(
      routeService.generateRoutesCode(true).replaceAll(testDir, 'TEST_DIR')
    ).toMatchInlineSnapshot(`
      "
                import React from 'react';
                

                import Route0 from \\"TEST_DIR/a.mdx\\";
      import Route1 from \\"TEST_DIR/guide/index.mdx\\";

                  export const routes = [
                    { path: '/a', element: React.createElement(Route0), preload: ()=> import('TEST_DIR/a.mdx')  },
      { path: '/guide/', element: React.createElement(Route1), preload: ()=> import('TEST_DIR/guide/index.mdx')  },
                    ];
          "
    `);
  });
});
