const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口 - 相对路径(相对于项目根目录，比如这里是相对webpack-study目录)
    entry: './src/main.js',
    // 出口 - 绝对路径
    output: {
        path: undefined, // 开发模式不会输出资源，所以不用path，但是filename还是要保留
        filename: 'static/js/main.js'
    },
    // 加载器
    module: {
        rules: [
            // 配置loader规则
            {
                // oneOf使每个正则匹配的文件只匹配一个loader，如果匹配到后面的loader就不再遍历了，加快构建速度
                oneOf: [
                    {
                        test: /\.css$/, // 注意是正则，不是字符串，test匹配所有.css结尾的文件
                        use: ["style-loader", "css-loader"] // css-loader将css以commonjs模块化插入到js，style-loader动态生成style标签插入到html
                    },
                    {
                        test: /\.less$/,
                        // loader: 'less-loader', 只能使用一个loader
                        use: ['style-loader', 'css-loader', 'less-loader'] // 使用多个loader
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: ['style-loader', 'css-loader', 'sass-loader']
                    },
                    {
                        test: /\.styl$/,
                        use: ['style-loader', 'css-loader', 'stylus-loader']
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp|svg)$/,
                        type: 'asset', // 相当于webpack4的file-loader和url-loader打包图片资源
                        parser: {
                            dataUrlCondition: {
                                // 小于50k的会被转化为base64
                                // 优点-减少请求数量 缺点-体积会变大一些
                                maxSize: 50 * 1024
                            }
                        },
                        // 输出文件的配置
                        generator: {
                            // 生成的文件名
                            // [hash:10] - 表示取生成的以哈希值为文件名的前10位
                            // [ext] - 表示文件的后缀 如.jpg
                            // [query] - 表示问号后面的如xxx.jpg?query=xx
                            filename: 'static/images/[hash:10][ext][query]'
                        }
                    },
                    {
                        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
                        type: 'asset/resource', // asset/resource表示原封不动输出,像mp3等音视频资源可以统一不作处理输出
                        generator: {
                            filename: 'static/media/[hash:10][ext][query]'
                        }
                    },
                    {
                        test: /\.js$/,
                        // exclude: /node_modules/, // exclude 除了node_modules下的文件，其他文件都处理（正则）
                        include: path.resolve(__dirname, '../src'), // 只处理src目录下的文件（绝对路径）（两者互斥，只能有1个配置）eslint也类似
                        loader: 'babel-loader',
                        options: {
                            // presets: ['@babel/preset-env'] // 可以把配置写在配置文件
                            // babel对js的缓存写在options对象中，生成的缓存文件会在node_modules/.cache/babel-loader目录下
                            cacheDirectory: true, // 开启缓存，这样eslint或babel第二次对js处理的时候就会只对修改的文件做处理，其他没变化的用缓存的文件即可
                            cacheCompression: false // 关闭缓存压缩，这样可以减少生成缓存时间，他只是存在内存，服务停止会被清除，所以不压缩就大一点，只是占用内存
                        }
                    }
                ]
            }
        ]
    },
    // 插件
    plugins: [
        // 配置Eslint插件
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src'), // src下的文件会被检测
            exclude: 'node_modules', // 不检测node_modules目录下的文件（默认值）
            cache: true, // eslint也可以开启缓存，就只对修改的js做处理，加快构建速度
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintcache') // 缓存的位置，绝对路径
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html') // 会以该文件作为模版，插入打包后的bundle js
        })
    ],
    // 开发服务器,不会输出资源（即不会生成dist打包后的文件），是在内存中编译打包的
    // 需要运行npx webpack serve 而不是 npx webpack
    devServer: {
        host: 'localhost',
        port: '3000',
        open: true,
        hot: true // 开启热模块替换(HMR),默认为true，因为开发环境的配置文件，css有style-loader处理，所以style-loader会自动开启HMR
    },
    // 模式
    mode: 'development',
    devtool: 'cheap-module-source-map' // 开启sourcemap，cheap是报错只提示行不提示列
}