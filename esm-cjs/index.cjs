// const { add } = require("./util.mjs");

async function foo() {
	// 如果要在 CJS 模块中调用 ESM 模块中的内容，需要使用 await import("路径")，而且必须要有异步（async）环境
	// 因为 CJS 模块是通过 require 同步加载，ESM 是通过 import 异步加载的。所以同步的 require 并不能导入ESM模块
	const { add } = await import("./util.mjs");
	console.log(add(1, 2));
}
foo();
