import { resolve } from 'path';
import fs from 'fs-extra';
import { loadConfigFromFile } from 'vite';
import { UserConfig } from '../shared/types/index';

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

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
) {
  // 1.获取配置文件路径，支持 js、ts 格式
  const configPath = getUserConfigPath(root);
  // 2.解析配置文件
  // loadConfigFiles是 vite中解析配置文件的api
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
