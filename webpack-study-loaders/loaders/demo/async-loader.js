// 异步loader 要调用async方法，返回一个callback，等异步操作执行完再执行callback
module.exports = function(content, map, meta) {
    const callback = this.async()
    setTimeout(() => {
        console.log("async-loader")
        callback(null, content, map, meta)
    }, 1000)
}