import { defineConfig } from '../src/node/config';

export default defineConfig({
  title: 'welcome to island!',
  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '指南',
        link: '/guide/'
      }
    ]
  }
});
