/* 
    md表格语法：
    | 资源名称 | 资源大小 |
    | --- | --- |
    | xxx.js | 10kb |
*/
class AnalyzeWebpackPlugin {
    apply(compiler) {
        let content = `| 资源名称 | 资源大小 |
| --- | --- |`;
        
        
        compiler.hooks.emit.tap('AnalyzeWebpackPlugin', (compilation) => {
            // 1.拼接表格
            Object.entries(compilation.assets).forEach(([filename, asset]) => {
                content += `\n| ${filename} | ${Math.ceil(asset.size()/1024)}kb |`;
            })

            // 2.生成md文件(compilation.assets['analyze.md']表示新建一个analyze.md文件，source方法返回文件内容，size方法返回文件大小)
            compilation.assets['analyze.md'] = {
                source() {
                    return content;
                },
                size() {
                    return content.length;
                }
            }
        })
    }
}

module.exports = AnalyzeWebpackPlugin;