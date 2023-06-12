import { resolve } from 'path';
import fs from 'fs-extra';
import { loadConfigFromFile, normalizePath } from 'vite';
import { SiteConfig, UserConfig } from '../shared/types/index';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

// 在当前root下去查找配置文件路径
function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.js', 'config.ts'];
    const configPath = supportConfigFiles
      .map((file) => {
        // resolve() 方法会把一个路径或路径片段的序列解析为一个绝对路径,root为当前路径, file为文件名,返回的是一个绝对路径,如D:\SSG\docs\config.ts
        return resolve(root, file);
      })
      // fs.pathExistsSync 判断文件是否存在
      .find(fs.pathExistsSync);
    return configPath;
  } catch (error) {
    console.log('Failed to load user config');
    throw error;
  }
}

// 相当于给用户传入的配置文件内容进行处理，如果用户没有传入配置文件，那么就使用默认的配置文件
function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'island.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
}

// 为什么是Promise<SiteConfig>，因为resolveConfig方法是异步的
// resolveConfig 的作用是获取配置文件路径和配置文件内容，然后返回一个 SiteConfig 对象。
export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
): Promise<SiteConfig> {
  // configPath 在 docs 下时为 'D:/SSG/docs/config.ts'
  // userConfig 在 docs 下时为 config: { title: '1112' }
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);

  // normalizePath 会将路径中的 \ 转换为 /
  // resolveSiteData 把用户传入的配置文件内容进行处理
  const siteConfig: SiteConfig = {
    root: normalizePath(root),
    configPath: normalizePath(configPath),
    siteData: resolveSiteData(userConfig as UserConfig)
  };
  return siteConfig;
}

// 获取配置文件路径
export async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  // 1.获取配置文件路径，支持 js、ts 格式
  // 执行 island dev docs 时配置文件路径为 D:\SSG\docs\config.ts
  const configPath = getUserConfigPath(root);
  // 2.解析配置文件
  // loadConfigFromFile 会返回一个对象，包含了配置文件的路径、配置文件的内容、配置文件的依赖
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
