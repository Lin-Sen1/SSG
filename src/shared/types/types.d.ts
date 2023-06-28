/// <reference types="vite/client" />

// declare 声明的类型，可以在全局使用，也可以在模块中使用import导入
declare module 'island:site-data' {
  import type { UserConfig } from 'shared/types';
  const siteData: UserConfig;
  export default siteData;
}

declare module 'island:routes' {
  import type { Route } from 'node/plugin-routes';
  export const routes: Route[];
}
