import { defineConfig } from 'tsup';

export default defineConfig({
  // 入口
  entry: ['src/node/cli.ts'],
  // 开启bundle模式
  bundle: true,
  // 开启拆包
  splitting: true,
  // 产物打包到dist目录
  outDir: 'dist',
  // 打包为cjs和ems两种格式
  format: ['cjs', 'esm'],
  // 生成类型文件
  dts: true,
  // 会自动帮我们注入一些 API 的 polyfill 代码，如 __dirname, __filename, import.meta 等等，保证这些 API 在 ESM 和 CJS 环境下的兼容性
  shims: true,
  // 使用它可以在生成的 JavaScript 和 CSS 文件的开头插入任意字符串。
  banner: {
    js: 'import { createRequire as createRequire0 } from "module"; const require = createRequire0(import.meta.url);'
  }
});
