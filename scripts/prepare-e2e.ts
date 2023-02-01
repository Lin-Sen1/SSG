import path from 'path';
import fse from 'fs-extra';
import * as execa from 'execa';
const exampleDir = path.resolve(__dirname, '../e2e/playground/basic');

console.log('path is :', exampleDir);

// 项目根目录
const ROOT = path.resolve(__dirname, '..');

const defaultOptions = {
  // 子进程相关
  // stdout、studin、stderr都是可读可写流
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

async function prepareE2E() {
  if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
    // execa是可以调用shell和本地外部程序的javascript封装。会启动子进程执行。
    // 如果父进程退出，则生成的全部子进程都被杀死。
    execa.commandSync('pnpm build', {
      // cwd 工作目录
      cwd: ROOT
    });
  }

  execa.commandSync('npx playwright install', {
    cwd: ROOT
  });

  execa.commandSync('pnpm i', {
    cwd: exampleDir,
    ...defaultOptions
  });

  // 启动命令
  execa.commandSync('pnpm dev', {
    cwd: exampleDir,
    ...defaultOptions
  });
}

prepareE2E();
