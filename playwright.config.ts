import type { PlaywrightTestConfig } from '@playwright/test';

// 1.创建测试项目
// 2.启动测试项目
// 3.开启无头浏览器进行访问

const config: PlaywrightTestConfig = {
  // 测试文件存放的目录
  testDir: './e2e',
  // 超时时间
  timeout: 50000,
  webServer: {
    url: 'http://localhost:5173',
    command: 'pnpm prepare:e2e'
  },
  use: {
    // 没有UI界面的无头游览器
    headless: true
  }
};

export default config;
