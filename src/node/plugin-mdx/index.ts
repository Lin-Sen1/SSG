import { pluginMdxRollup } from './pluginMdxRollup';
// import { pluginMdxHMR } from './pluginMdxHmr';

// vite热更新机制
// 1.监听文件变动，vite里边的监听器会监听到，vite内部存在一个依赖图，会有每个模块之间的依赖关系，根据算法能定位到热更新的边界模块
// 2.定位到热更新边界模块
// 3.执行更新逻辑

// vite中import.meta.hot.accept() 这个api覆盖了第二步和第三步的步骤

export async function createMdxPlugins() {
  return [await pluginMdxRollup()];
}
