// 此文件是服务端（即SSR）入口代码
import { App, initPageData } from './app';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hooks';
import { HelmetProvider } from 'react-helmet-async';
export interface RenderResult {
  appHtml: string;
  islandProps: unknown[];
  islandToPathMap: Record<string, string>;
}

export async function render(pagePath: string, helmetContext: object) {
  // 将一个 React 元素渲染成其初始的 HTML。React 将返回一个 HTML 字符串。你可以使用这种方法在服务器上生产 HTML，并在初始请求中发送标记。以加快页面加载速度，并允许搜索引擎以 SEO 为目的抓取你的页面。
  // 如果你在一个已被服务端渲染标记的节点上调用 ReactDOM.hydrateRoot()，React 会保留它，只附加事件处理程序，让你有一个非常良好的首次加载体验。

  // 生产 pageData
  const pageData = await initPageData(pagePath);

  const { clearIslandData, data } = await import('./jsx-runtime');
  clearIslandData();
  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <DataContext.Provider value={pageData}>
        <StaticRouter location={pagePath}>
          <App />
        </StaticRouter>
      </DataContext.Provider>
    </HelmetProvider>
  );
  const { islandProps, islandToPathMap } = data;
  return {
    appHtml,
    islandProps,
    islandToPathMap
  };
}

export { routes } from 'island:routes';
