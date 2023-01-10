import cac from "cac";
import path = require("path");
import { createDevServer } from "./dev";

const currentVersion = require("../../package").version;

const cli = cac("island").version(currentVersion).help();

cli.command("dev [root]", "start dev server").action(async (root: string) => {
	// resolve操作相当于进行了一系列的cd操作
	root = root ? path.resolve(root) : process.cwd();
	const server = await createDevServer(root);
	await server.listen();
	server.printUrls();
});

cli
	.command("build [root]", "build in production")
	.action(async (root: string) => {
		console.log("build", root);
	});

cli.parse();
