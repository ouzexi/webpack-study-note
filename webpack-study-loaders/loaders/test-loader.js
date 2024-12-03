/* 
    loader就是一个函数，需要module.epxorts导出
    当webpack解析资源时，会调用相应的loader去处理
    loader接收到文件内容作为参数，返回内容出去
        content - 文件内容
        map - SourceMap相关
        meta - 别的loader传递过来的数据
*/
module.exports = function(content, map, meta) {
    console.log("content:", content)
    return content;
}