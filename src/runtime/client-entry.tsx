// 浏览器端执行的入口文件
import { createRoot } from 'react-dom/client';
import { App } from './app';

// 开启约定式路由
import { BrowserRouter } from 'react-router-dom';

function renderInBrowser() {
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  // 这里能拿到siteData的值是因为在vite的pluginConfig中配置了island:site-data，在load钩子中返回的

  createRoot(containerEl).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

renderInBrowser();
