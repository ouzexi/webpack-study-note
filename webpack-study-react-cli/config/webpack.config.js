const path = require('path');
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'; // process.env.NODE_ENV是cross-env中NODE_ENV的值

const srcPath = path.resolve(__dirname, '../src')

const getStyleLoaders = (pre) => {
    return [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: ['postcss-preset-env']
            }
        }
    }, pre && {
        loader: pre,
        options: pre === 'less-loader' ? { // 因为antd通过less来重写变量，所以要配置less-loader
            lessOptions: {
                // 修改全局变量
                modifyVars: {
                    "@primary-color": "#FFCCCC" // 全局主色
                },
                // 允许执行js
                javascriptEnabled: true
            }
        } : {}
    }].filter(Boolean)
}

module.exports = {
    entry: './src/main.js',
    output: {
        path: isProduction ? path.resolve(__dirname, '../dist') : undefined,
        filename: isProduction ? 'static/js/[name].js' : 'static/js/[name].[contenthash:10].js', // 生产模式不需要修改文件影响缓存，所以不用contenthash
        chunkFilename: isProduction ? 'static/js/[name].chunk.js' : 'static/js/[name].[contenthash:10].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]',
        clean: true // 开发模式这个留不留都不影响，因为没东西让它清理
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
                    plugins: [!isProduction && 'react-refresh/babel'].filter(Boolean) // 开启JS的HMR功能 2 (开发模式才需要HMR)
                    // 当是生产模式时，plugins: [false]会报错，所以要.filter(Boolean)变成空数组
                }
            }
        ]
    },
    plugins: [
        !isProduction && new ESLintWebpackPlugin({
            context: srcPath,
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache')
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        isProduction && new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css'
        }),
        // 默认不会把public目录的资源打包到dist，所以要用copy-webpack-plugin复制public下的文件过去
        isProduction && new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    globOptions: {
                        ignore: ["**/index.html"] // **是忽略public目录下所有层级目录下的index.html文件
                    }
                }
            ]
        }),
        !isProduction && new ReactRefreshWebpackPlugin() // 开启JS的HMR功能 3
    ].filter(Boolean), // 把为false的项清除
    optimization: {
        minimize: isProduction, // 生产模式才压缩，当minimize为false时，minimizer不生效
        minimizer: [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin({
                 // 默认会把node_modules中打包生成的文件额外生成txt，把该文件包含哪些依赖包列出来
                 // 比如下面cacheGroups中chunk-react，他的txt会注释提取 react react-dom react-router-dom这些包
                extractComments: false
            })
        ],
        splitChunks: {
            chunks: 'all',
            // 因为node_modules全打包成一个js文件太大了，所以将它分包，但是注意也不能分成太多文件，否则也会发送太多请求
            cacheGroups: {
                // 将react react-dom react-router-dom 打包成一份
                react: {
                    name: 'chunk-react',
                    test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,  // [\\/]表示路径可能为node_modules/react（需要转义） 或者 node_modules\react
                    priority: 40 // 优先级要比libs的高，否则会被libs的打包进去了
                },
                // 将antd打包成一份
                antd: {
                    name: 'chunk-antd',
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    priority: 30
                },
                // 将其他剩下的打包成一份
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 20
                }
            }
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
    // 生产模式留不留都无所谓，因为不会走webpack-dev-server，所以devServer配置不会生效
    devServer: {
        host: 'localhost',
        port: 3088,
        open: true,
        hot: true, // 开启JS的HMR功能 1
        historyApiFallback: true // 解决react-router刷新404问题 --> 404s will fallback to '/index.html'
        // （原理是刷新时，如果通过当前url获取不到静态资源，就会返回index.html，index.html就会执行js使解析当前url对应的页面）
    },
    mode: isProduction ? 'production' : 'development',
    // devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    devtool: isProduction ? false : 'cheap-module-source-map',
    performance: false // 关闭性能分析，加快打包速度（比如打包时会分析代码并提示某些资源过大：WARNING in entrypoint size limit）
}