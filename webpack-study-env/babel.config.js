module.exports = {
    presets: [
        ['@babel/preset-env', {
            // 在main.js中一个个引入corejs的polyfill如Promise很麻烦，而且有可能会忘记，所以可以在preset-env中设置选项，
            // useBuiltIns: "usage" 表示用到哪个就自动导入哪个，entry是全部导入，corejs: 3是指定corejs的版本
            useBuiltIns: "usage",
            corejs: 3
        }]
    ],
     //默认情况下，babel会对公共方法插入辅助函数如_extend
     //这样每个被babel处理的js文件都会重复定义重复注入
     //@babel/plugin-transform-runtime帮助需要处理的js文件从中引入辅助函数，就不需要重复定义，减少代码体积
    plugins: ['@babel/plugin-transform-runtime']
}