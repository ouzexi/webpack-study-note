class BannerWebpackPlugin {

    // 获取选项，赋值给内部
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        // 在资源输出（文件生成）前触发
        compiler.hooks.emit.tapAsync('BannerWebpackPlugin', (compilation, callback) => {
            const extensions = ['css', 'js']
            // 1. 获取即将输出的资源文件：compilation.assets
            const assets = Object.keys(compilation.assets).filter((asset) => {
                // 2.过滤js或css文件
                const assetSplit = asset.split('.')
                const extension = assetSplit[assetSplit.length - 1];
                return extensions.includes(extension)
            })

            const prefix = `/*
* Author: ${this.options.author}
*/`
            // 3.给每个文件加上注释
            assets.forEach(asset => {
                // source()获取文件内容
                const source = compilation.assets[asset].source();
                // 拼接注释
                const content = prefix + source;

                // 修改资源
                compilation.assets[asset] = {
                    // 最终资源输出时，调用source方法，它的返回值就是资源的具体内容
                    source() {
                        return content;
                    },
                    // 同时必须返回资源大小
                    size() {
                        return content.length;
                    }
                }
            })

            callback()
        })
    }
}

module.exports = BannerWebpackPlugin;