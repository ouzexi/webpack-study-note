const path = require('path')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const srcPath = path.resolve(__dirname, '../src')

const isProduction = process.env.NODE_ENV === 'production'

const getStyleLoaders = (pre) => {
    return [isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: ['postcss-preset-env']
            }
        }
    }, pre && {
        loader: pre,
        options: pre === 'sass-loader' ? {
            // 自定义主题：自动引入我们定义的scss文件,这里的@/styles..要配置alias别名
            additionalData: `@use "@/styles/element/index.scss" as *;`,
        } : {}
    }].filter(Boolean)
}

module.exports = {
    entry: './src/main.js',
    output: {
        path: isProduction ? path.resolve(__dirname, '../dist') : undefined,
        filename: isProduction ? 'static/js/[name].[contenthash:10].js' : 'static/js/[name].js', // 生产模式才用hash值，开发不用，因为生产可以需要缓存
        chunkFilename: isProduction ? 'static/js/[name].[contenthash:10].chunk.js' : 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]',
        clean: true
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
                loader: 'vue-loader', // 内部会给vue文件注入HMR功能
                options: {
                    // 开启缓存
                    cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/vue-loader')
                }
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
        }),
        isProduction && new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    globOptions: {
                        ignore: ["**/index.html"]
                    }
                }
            ]
        }),
        isProduction && new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css'
        }),
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver({
            importStyle: "sass", // 自定义主题
          })],
        }),
    ].filter(Boolean),
    optimization: {
        minimize: isProduction,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin({
                extractComments: false
            })
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vue: {
                    test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                    name: 'vue-chunk',
                    priority: 40
                },
                elementPlus: {
                    test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                    name: 'elementPlus-chunk',
                    priority: 30
                },
                libs: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'libs-chunk',
                    priority: 20
                }
            }
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}`
        }
    },
    mode: isProduction ? 'production' : 'development',
    // devtool: 'source-map',
    devtool: isProduction ? false : 'cheap-module-source-map',
    resolve: {
        extensions: ['.vue', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true
    },
    performance: false // 关闭性能分析，加快打包速度
}