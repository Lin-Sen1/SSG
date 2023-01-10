// dev server 初始化相关逻辑

import { createServer as createViteDevServer } from "vite";
import { pluginIndexHtml } from "./plugin-island/indexHtml";
import pluginReact from "@vitejs/plugin-react";

// process.cwd() 返回当前工作目录
export async function createDevServer(root = process.cwd()) {
	return createViteDevServer({
		root,
		plugins: [pluginIndexHtml(), pluginReact()],
	});
}
