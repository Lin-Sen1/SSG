import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    //
    passWithNoTests: true,
    // 排除这些路径
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    // 开启多线程测试模式
    threads: true
  }
});
