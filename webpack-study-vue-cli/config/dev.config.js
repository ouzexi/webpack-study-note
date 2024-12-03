const path = require('path')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require('webpack')
const srcPath = path.resolve(__dirname, '../src')

const getStyleLoaders = (pre) => {
    return ['vue-style-loader', 'css-loader', {
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
            // 配置样式
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
            // 配置js
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: srcPath,
                // exclude: 'node_modules',
                options: {
                    cacheDirectory: true,
                    cacheCompression: false
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader' // 内部会给vue文件注入HMR功能
            },
            // 配置资源
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 *  1024
                    }
                }
            },
            {
                test: /\.(tff|woff2?|mp[34])$/,
                type: 'asset/resource'
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
        new VueLoaderPlugin(), // 配置了vue-loader，一定要使用该插件,他会把vue文件的script部分当作js，style当作css处理
        // cross-env的NODE_ENV是给webpack等打包工具使用
        // DefinePlugin定义的变量是给源代码使用，如__VUE_OPTIONS_API__是否允许使用options API，__VUE_PROD_DEVTOOLS__生产模式是否开启调试工具
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        })
    ],
    optimization: {
        // minimize: true,
        // minimizer: [],
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}`
        }
    },
    mode: 'development',
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.vue', '.js', '.json']
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true
    }
}