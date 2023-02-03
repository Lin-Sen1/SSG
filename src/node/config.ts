import { resolve } from 'path';
import fs from 'fs-extra';
import { loadConfigFromFile } from 'vite';
import { SiteConfig, UserConfig } from '../shared/types/index';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.js', 'config.ts'];
    const configPath = supportConfigFiles
      .map((file) => {
        return resolve(root, file);
      })
      // TODO:  fs.pathExistsSync 这个api还没有明白
      .find(fs.pathExistsSync);
    return configPath;
  } catch (error) {
    console.log('Failed to load user config');
    throw error;
  }
}

function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'island.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
) {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);

  const siteConfig: SiteConfig = {
    root,
    configPath,
    siteData: resolveSiteData(userConfig as UserConfig)
  };
  return siteConfig;
}

export async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  // 1.获取配置文件路径，支持 js、ts 格式
  const configPath = getUserConfigPath(root);
  // 2.解析配置文件
  // TODO:  可以研究下这个api ; loadConfigFiles是 vite中解析配置文件的api
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );
  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    // rawConfig有3种形式
    // 1.object
    // 2.promise
    // 3.function

    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);

    // as const 让 ts 能够自动的推断出返回值类型
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

// 直接返回传入的config，使其出现类型提示
export function defineConfig(config: UserConfig): UserConfig {
  return config;
}
