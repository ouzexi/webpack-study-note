class CleanWebpackPlugin {
    apply(compiler) {
        // 1.获取打包输出的目录
        const outputPath = compiler.options.output.path;
        const fs = compiler.outputFileSystem; // (outputFileSystem是插件的操作文件的内置模块)

        // 2.注册钩子，在打包输出前emit
        compiler.hooks.emit.tap('CleanWebpackPlugin', (compilation) => {
            // 3.通过fs删除目录下的所有资源
            this.removeFiles(fs, outputPath)
        })
    }

    removeFiles(fs, filePath) {
        // 1.读取当前目录下的所有资源
        const files = fs.readdirSync(filePath);
        // 2.遍历一个个删除
        files.forEach(file => {
            const path = `${filePath}/${file}`;
            // 2.1 遍历一个个文件，判断是文件还是目录
            const fileStat = fs.statSync(path);
            // 2.2 如果是目录，就要递归删除目录下所有资源后才能删除该目录
            if(fileStat.isDirectory()) {
                this.removeFiles(fs, path)
            }
            // 2.3 如果是文件，直接删除
            else {
               fs.unlinkSync(path);
            }
        })
    }
}

module.exports = CleanWebpackPlugin;