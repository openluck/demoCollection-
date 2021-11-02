module.exports = {
    root: true,
    env: {
        node: true,
    },
    // extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
    // extends: ["plugin:vue/essential", "eslint:recommended", "standard"],
    extends: ["plugin:vue/essential", "eslint:recommended"],

    parserOptions: {
        parser: "babel-eslint",
    },
    plugins: ["vue"],
    overrides: [{
        files: [
            "**/__tests__/*.{j,t}s?(x)",
            "**/tests/unit/**/*.spec.{j,t}s?(x)",
        ],
        env: {
            jest: true,
        },
    }, ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        "no-unused-expressions": 0 //禁止无用的表达式
    },
};