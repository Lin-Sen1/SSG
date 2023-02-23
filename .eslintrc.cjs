module.exports = {
	// 通过extend配置的规则会自动开启,不需要在roles中配置
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"plugin:prettier/recommended",
	],
	// 使用ts时必须添加这个配置,否则esLint底层无法解析ts代码
	parser: "@typescript-eslint/parser",
	parserOptions: {
		// 开启jsx解析
		ecmaFeatures: {
			jsx: true,
		},
		// last 启用最新的 ES 语法
		ecmaVersion: "latest",
		// 默认为script，如果使用 ES Module 则应设置为module
		sourceType: "module",
	},
	// eslint 本身没有内有ts代码规则，需要安装@typescript-eslint/eslint-plugin
	// 此处只是配置,在roles中开启规则校验
	plugins: ["react", "@typescript-eslint", "react-hooks", "prettier"],
	// 相当于自定义的规则
	rules: {
		// error开启规则，违背后抛出error
		"prettier/prettier": "error",
		// 使用单引号
		quotes: ["error", "single"],
		// 没分号时报错
		semi: ["error", "always"],
		// off关闭规则
		"@typescript-eslint/no-non-null-assertion": "off",
		// 关掉使用react时必须importReact语法的规则
		"react/react-in-jsx-scope": "off",
    // TODO: require报错临时方案
    "@typescript-eslint/no-var-requires":"off",
		"no-debugger":"off"
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
