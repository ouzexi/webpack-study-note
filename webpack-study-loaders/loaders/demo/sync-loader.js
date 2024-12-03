// 同步loader - 第一种写法 只能返回处理后的文件内容
/* module.exports = function(content) {
    return content;
} */

// 同步loader - 第二种写法，可以返回是否错误、处理后的内容以及给下一个loader传递source-map或参数
module.exports = function(content, map, meta) {
    console.log("sync-loader")
    /* 
        this.callback可以返回loader处理后的数据
        第一个参数：err代表是否有错误
        第二个参数：content - 处理后的内容
        第三个参数：source-map - 继续传递给下一个loader的source-map
        第四个参数：meta - 继续传递给下一个loader的参数（比如css-loader传递给style-loader）
    */
    this.callback(null, content, map, meta)
}