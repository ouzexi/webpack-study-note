// raw-loader 同步异步都可，区别是他的内容是Buffer类型（二进制），可用于处理图标，图片等资源
/* module.exports = function(content) {
    console.log("raw-loader", content)
    return content;
}

module.exports.raw = true */

function rawLoader(content) {
    console.log("raw-loader", content)
    return content;
}

rawLoader.raw = true;

module.exports = rawLoader