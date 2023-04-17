import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

const options: VitePluginConfig = {
  /**
   * @name presetAttributify 用来做属性化的支持
   * @name presetWind 兼容tailwindCss和windiCss语法
   * @name presetIcons 接入图标的功能
   */
  presets: [presetAttributify(), presetWind({}), presetIcons()]
};

export default options;
