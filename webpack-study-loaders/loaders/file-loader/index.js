const loaderUtils = require('loader-utils')

module.exports = function(content) {
    // 1.生成带hash值的文件名
    // 第一个参数是上下文，这里是loader的上下文this
    // 第二个参数是生成文件名规则
    // 第三个参数是选项，content是文件的内容
    let interpolatedName = loaderUtils.interpolateName(
      this,
      '[hash].[ext][query]',
      { content: content }
    );
    interpolatedName = 'images/'+interpolatedName;
    // 2.输出文件到dist目录
    // emitFile输出文件，第一个参数是生成的文件名，第二个参数是文件的内容
    this.emitFile(interpolatedName, content)
    // 3.返回module.exports = "文件路径（文件名）"
    return `module.exports = "${interpolatedName}"`
}

// 需要处理图片等buffer数据，所以是raw-loader
module.exports.raw = true