import cac from "cac";
import path = require("path");
import { createDevServer } from "./dev";
// import { generateHtmlFn } from "./genTemplate";

const currentVersion = require("../../package").version;

// 创建cac实例
// version 定义版本号
// help定义帮助信息
const cli = cac("island").version(currentVersion).help();

// action 如果输入的命令与之匹配，则使用回调函数作为命令操作
cli.command("dev [root]", "start dev server").action(async (root: string) => {
	// resolve操作相当于进行了一系列的cd操作
	root = root ? path.resolve(root) : process.cwd();
	const server = await createDevServer(root);
	await server.listen();
	server.printUrls();
	// generateHtmlFn();
});

cli
	.command("build [root]", "build in production")
	.action(async (root: string) => {
		console.log("build", root);
	});

cli.parse();
