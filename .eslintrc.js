module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
    parserOptions: {
        ecmaVersion: 2020,
    },

    plugins: ['vue'],
    rules: {
        'no-multiple-empty-lines': 0, // 禁用不允许多行空格
    },
};
