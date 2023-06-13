// 浏览器端执行的入口文件
import { createRoot } from 'react-dom/client';
import { App, initPageData } from './app';

// 开启约定式路由
import { BrowserRouter } from 'react-router-dom';

async function renderInBrowser() {
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }

  const pageData = await initPageData(location.pathname);

  createRoot(containerEl).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

renderInBrowser();
