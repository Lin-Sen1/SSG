// 此文件是服务端（即SSR）入口代码
import { App, initPageData } from './app';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hooks';

export async function render(pagePath: string) {
  // 将一个 React 元素渲染成其初始的 HTML。React 将返回一个 HTML 字符串。你可以使用这种方法在服务器上生产 HTML，并在初始请求中发送标记。以加快页面加载速度，并允许搜索引擎以 SEO 为目的抓取你的页面。
  // 如果你在一个已被服务端渲染标记的节点上调用 ReactDOM.hydrateRoot()，React 会保留它，只附加事件处理程序，让你有一个非常良好的首次加载体验。

  // 生产 pageData
  const pageData = await initPageData(pagePath);

  // https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostring
  return renderToString(
    // location相当于一个默认的路由
    <DataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </DataContext.Provider>
  );
}

export { routes } from 'island:routes';
