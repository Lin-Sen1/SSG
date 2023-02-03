// 浏览器端执行的入口文件
import { createRoot } from 'react-dom/client';
import { App } from './app';
import siteData from 'island:site-data';

function renderInBrowser() {
  console.log(siteData);
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  createRoot(containerEl).render(<App />);
}

renderInBrowser();
