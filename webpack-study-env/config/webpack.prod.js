const os = require("os");
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin"); // 这个是webpack内置的插件，生产模式压缩代码就是靠它实现的
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin")
const WorkboxPlugin = require('workbox-webpack-plugin')

// 多进程打包可以用于babel，eslint，terser对js的处理，相当于多个人做一件事，加快打包速度
const threads = os.cpus().length; // 获取cpu核数，多进程打包最大进程数就是cpu核数

// 用来获取处理css样式的loader
function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    // 在css-loader后面配置postcss
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
    pre,
  ].filter(Boolean); // 不传pre时为undefined，会被过滤掉
}

module.exports = {
  // 入口 - 相对路径(相对于项目根目录，比如这里是相对webpack-study目录)
  entry: "./src/main.js",
  // 出口 - 绝对路径
  output: {
    path: path.resolve(__dirname, "../dist"),
    // 入口文件打包输出的文件
    filename: "static/js/[name].[contenthash:10].js", // 将main.js改成[name].js好处是，如果将来改成多入口，那么输出的文件不会被覆盖
    // 其他输出的文件加上chunk与主bundle区别开来
    chunkFilename: "static/js/[name].[contenthash:10].chunk.js", // 这里是对模块打包输出的其他文件命名，如果有魔法命名如/* webpackChunkName: "math" */，那么[name]为math
    // 图片字体等通过type:asset或type:asset/resource等处理的资源，打包输出的文件名，这样就能统一命名，不用再在下面loader逐个写generator了
    assetModuleFilename: "static/media/[hash:10][ext][query]",
    // 相当于webpack4的clear-webpack-plugin，自动清空上一次的打包目录
    // 原理：把path对应的目录删除再打包
    clean: true,
    // 解决ie报错，Automatic publicPath is not supported in this browser
    // publicPath: './'
  },
  // 加载器
  module: {
    rules: [
      // 配置loader规则
      {
        oneOf: [
          {
            test: /\.css$/, // 注意是正则，不是字符串，test匹配所有.css结尾的文件

            // 使用MiniCssExtractPlugin.loader代替style-loader，因为style-loader是创建style标签插入样式，会导致一开始加载白屏
            // MiniCssExtractPlugin.loader会把所有css样式提取成一个文件，通过link引入到html
            use: getStyleLoader(),
          },
          {
            test: /\.less$/,
            // loader: 'less-loader', 只能使用一个loader
            use: getStyleLoader("less-loader"), // 使用多个loader
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoader("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoader("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset", // 相当于webpack4的file-loader和url-loader打包图片资源
            parser: {
              dataUrlCondition: {
                // 小于50k的会被转化为base64
                // 优点-减少请求数量 缺点-体积会变大一些
                maxSize: 50 * 1024,
              },
            },
            // 输出文件的配置
            /* generator: {
              // 生成的文件名
              // [hash:10] - 表示取生成的以哈希值为文件名的前10位
              // [ext] - 表示文件的后缀 如.jpg
              // [query] - 表示问号后面的如xxx.jpg?query=xx
              filename: "static/images/[hash:10][ext][query]",
            }, */
          },
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            type: "asset/resource", // asset/resource表示原封不动输出,像mp3等音视频资源可以统一不作处理输出
            /* generator: {
              filename: "static/media/[hash:10][ext][query]",
            }, */
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // exclude 除了node_modules下的文件，其他文件都处理（正则）
            include: path.resolve(__dirname, "../src"), // 只处理src目录下的文件（绝对路径）（两者互斥，只能有1个配置）eslint也类似
            // babel对js的多线程处理，用thread-loader实现
            // thread-loader要放在babel-loader之前
            use: [
              {
                loader: "thread-loader",
                options: {
                  workers: threads, // 开启多进程，并设置进程数量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  // 一般生成环境不开启缓存，这里是为了演示
                  cacheDirectory: true,
                  cacheCompression: false,
                  // plugins: ['@babel/plugin-transform-runtime']
                  // presets: ['@babel/preset-env'] // 可以把配置写在配置文件
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    // 配置Eslint插件
    new ESLintPlugin({
      context: path.resolve(__dirname, "../src"), // src下的文件会被检测
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ),
      threads: threads, // eslint开启多进程处理js并设置进程数
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"), // 会以该文件作为模版，插入打包后的bundle js
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css", // 可以指定输出的css文件的名称
      chunkFilename: "static/css/[name].chunk.css" // 如果动态引入的js中引入了css，那么这些css也会被独立打包输出chunk，那么就需要命名,比如动态引入的math.js引入了css
    }),
    // preload和prefetch可以让浏览器预先加载资源但不执行，这样用户执行加载大文件时就不用等很久
    new PreloadWebpackPlugin({
      rel: "prefetch"
    }),
    // 配置PWA，原理是用到service workers
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true
    })
    /* new CssMinimizerPlugin(),
        new TerserWebpackPlugin({
            parallel: threads // terser开启多进程处理js并设置进程数
        }) */
    // 压缩图片
    /* new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminGenerate,
        options: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            [
              "svgo",
              {
                plugins: [
                  "preset-default",
                  "prefixIds",
                  {
                    name: "sortAttrs",
                    params: {
                      xmlnsOrder: "alphabetical",
                    },
                  },
                ],
              },
            ],
          ],
        },
      },
    }), */
  ],
  // 对打包的优化配置
  optimization: {
    // minimize: true, // 开启默认压缩策略
    // 压缩的配置，上面CssMinimizerPlugin和TerserWebpackPlugin插件可以写在minimizer数组，因为都是压缩的操作
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserWebpackPlugin({
        parallel: threads, // terser开启多进程处理js并设置进程数
      }),
      // 压缩图片
    //   new ImageMinimizerPlugin({})
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all' // 对所有模块进行分割
    },
    // 浏览器会对静态资源做缓存处理的，比如第一次加载资源后会缓存，第二次就从缓存中取，那么当静态资源内容发生改变时，才会使缓存失效，重新加载资源
    // 缓存的实现原理是通过资源名的hash值有无发生改变而判断是否取缓存还是重新加载，hash值不变则取缓存
    // 但是有一个问题就是，如果A资源引入了B资源，仅仅是B资源修改了内容，那么由于A资源会有比如require('B模块')的语句
    // 但由于B资源重新加载后文件名的hash值变了，导致A模块的如require('B模块文件名')也发生改变，那么就会使A也重新加载
    // 但是A内容没有改变，所以完全是可以使用缓存的资源的，但是还是重新加载资源，就没必要
    // 所以引入runtime文件，他会存储缓存的文件名，如存储B资源文件名，然后A引入runtime文件，从runtime文件取B文件名从而获取B资源
    // 这样当B资源重新加载时，只有B和runtime会重新加载，A或者其他引入了B的资源不会重新加载而是取缓存，这样就能使资源加载更快，不做没必要的更新
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`
    }
  },
  // 模式
  mode: "production",
  // devtool: 'source-map' // 生产模式一般不开启sourcemap，他会在js、css文件同级生成xx.map.js/css
};
