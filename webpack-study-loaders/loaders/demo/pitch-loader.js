module.exports = function(content) {
    console.log("pitch-loader")
    return content;
}

module.exports.pitch = function() {
    console.log("pitch")
    // return 'result'
}

// pitch-loader可以熔断，且pitch函数在loader执行前执行，如
// use: [loader1, loader2, loader3]
// 那么执行顺序为 pitch1 -> pitch2 -> pitch3 -> loader3 -> loader2 -> loader1
// 如果pitch2函数return了，那么只有pitch1 -> pitch2 -> loader1 执行，这个机制就叫熔断