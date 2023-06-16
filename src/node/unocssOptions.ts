import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

const options: VitePluginConfig = {
  /**
   * @plugin presetAttributify 用来做属性化的支持
   * @name presetWind 兼容tailwindCss和windiCss语法
   * @name presetIcons 接入图标的功能
   */
  presets: [presetAttributify(), presetWind({}), presetIcons()],
  rules: [
    [
      // \w+ 匹配任意方向的字符，用来匹配类名，添加border样式
      /^divider-(\w+)$/,
      ([, w]) => ({
        [`border-${w}`]: '1px solid var(--island-c-divider-light)'
      })
    ]
  ]
};

export default options;
