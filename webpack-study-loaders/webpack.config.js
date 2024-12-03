const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const TestPlugin = require('./plugins/test-plugin');
const BannerWepackPlugin = require('./plugins/banner-webpack-plugin')
const CleanWebpackPlugin = require('./plugins/clean-webpack-plugin')
const AnalyzeWebpackPlugin = require('./plugins/analyze-webpack-plugin')
const InlineChunkWebpackPlugin = require('./plugins/inline-chunk-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        clean: true
    },
    module: {
        rules: [
            /* {
                test: /\.js$/,
                loader: path.resolve(__dirname, 'loaders/test-loader.js')
            } */
            {
                test: /\.js$/,
                // 从右往左执行，所以会等异步loade执行完后才执行同步loader
                /* use: [
                    './loaders/demo/sync-loader.js',
                    './loaders/demo/async-loader.js',
                    './loaders/demo/raw-loader.js'
                ] */
                // loader: './loaders/demo/pitch-loader.js'
                loader: './loaders/clean-log-loader.js'
            },
            {
                test: /\.js$/,
                loader: './loaders/banner-loader/index.js',
                options: {
                    author: "区泽熙"
                }
            },
            {
                test: /\.js$/,
                loader: './loaders/babel-loader/index.js',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: './loaders/file-loader',
                type: 'javascript/auto' // 因为webpack5会自动把资源处理输出，所以要设置成javascript/auto阻止，避免重复输出
            },
            {
                test: /\.css$/,
                // use: ['style-loader', 'css-loader']
                use: ['./loaders/style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        }),
        // new TestPlugin()
        new BannerWepackPlugin({
            author: '区泽熙'
        }),
        new CleanWebpackPlugin(),
        new AnalyzeWebpackPlugin(),
        new InlineChunkWebpackPlugin([/runtime~(.*)\.js/g])
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}`
        }
    },
    mode: 'production'
}