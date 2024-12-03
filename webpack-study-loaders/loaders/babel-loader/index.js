const schema = require('./schema.json')
var babel = require("@babel/core");

module.exports = function(content) {
    // 异步loader
    const callback = this.async()
    // 使用@babel/presets-env
    const options = this.getOptions(schema)
    // 使用@babel/core的transform方法转换es6 -> es5
    // https://www.babeljs.cn/docs/babel-core

    // 第一个参数是源代码，第二个参数就是loader传递的options
    babel.transform(content, options, function(err, result) {
        // 如果转换失败，把err返回，否则返回转化后的代码result.code
        if(err) callback(err)
        else callback(null, result.code)
    });
}