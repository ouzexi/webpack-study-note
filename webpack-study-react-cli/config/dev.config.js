const path = require('path');
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const srcPath = path.resolve(__dirname, '../src')

const getStyleLoaders = (pre) => {
    return ['style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: ['postcss-preset-env']
            }
        }
    }, pre].filter(Boolean)
}

module.exports = {
    entry: './src/main.js',
    output: {
        path: undefined,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]'
    },
    module: {
        rules: [
            // 处理样式
            {
                test: /\.css$/,
                use: getStyleLoaders()
            },
            {
                test: /\.less$/,
                use: getStyleLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader')
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders('stylus-loader')
            },
            // 处理图片等资源
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                },
                /* generator: {
                    filename: ''
                } */
            },
            {
                test: /\.(ttf|woff2?)$/,
                type: 'asset/resource'
            },
            // 处理js
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                // exclude: 'node_modules',
                include: srcPath,
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: ['react-refresh/babel'] // 开启JS的HMR功能 2
                }
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            context: srcPath,
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache')
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new ReactRefreshWebpackPlugin() // 开启JS的HMR功能 3
    ],
    optimization: {
        /* minimize: true,
        minimizer: {

        }, */
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`
        }
    },
    // resolve是webpack解析模块加载选项
    resolve: {
        // 自动补全文件名，(必须是双引号！！)，比如引入import App from './App'，如果找到了App.jsx则加载它，并且不会再寻找App.js或App.json了 
        extensions: [".jsx", ".js", ".json"]
    },
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        host: 'localhost',
        port: 3088,
        open: true,
        hot: true, // 开启JS的HMR功能 1
        historyApiFallback: true // 解决react-router刷新404问题 --> 404s will fallback to '/index.html'
        // （原理是刷新时，如果通过当前url获取不到静态资源，就会返回index.html，index.html就会执行js使解析当前url对应的页面）
    }
}