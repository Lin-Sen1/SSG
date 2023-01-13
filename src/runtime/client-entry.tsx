// 浏览器端执行的入口文件
import { createRoot } from 'react-dom/client';
import { App } from './app';

function renderInBrowser() {
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  createRoot(containerEl).render(<App />);
}

renderInBrowser();
