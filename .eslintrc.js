module.exports = {

	extends: [
		"eslint:recommended",
		"airbnb",
	],

	parser: "babel-eslint",

	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
	},

	env: {
		browser: true,
		es6: true,
		mocha: true,
		node: true,
	},

	globals: {},

	rules: {
	  "class-methods-use-this": "off",
	  "no-alert": "warn",
   "no-console": "warn",
   "no-empty-function": "off",
   "no-return-await": "off",
   "no-shadow": "off",
   "no-trailing-spaces": "off",
   "no-underscore-dangle": "off",
   "no-unused-vars": "warn",
   "import/prefer-default-export": "off",
   "import/no-extraneous-dependencies": ["error", { devDependencies: true }, ],
	},

	plugins: [
		"import",
		"jsx-a11y",
		"react",
	],

};
