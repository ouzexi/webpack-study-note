// 在插件中需要通过safe-require引入插件
const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin');

class InlineChunkWebpackPlugin {
    constructor(tests = []) {
        this.tests = tests;
    }

    apply(compiler) {
      compiler.hooks.compilation.tap('InlineChunkWebpackPlugin', (compilation) => {
          // 1.获取html-wepback-plugin的hooks
          const hooks = HtmlWebpackPlugin.getHooks(compilation);
          // https://github.com/jantimon/html-webpack-plugin#alterassettaggroups-hook
          // 2.注册html-webpack-plugin的alterAssetTagGroups hooks，他是等html的script和link标签等组合好后触发
          hooks.alterAssetTagGroups.tap('InlineChunkWebpackPlugin', (asset) => {
            // 3.从这些标签中将script的runtime文件，变成inline script
            const headTags = this.getInlineChunk(asset.headTags, compilation);
            asset.headTags = headTags;
            const bodyTags = this.getInlineChunk(asset.bodyTags, compilation);
            asset.bodyTags = bodyTags;
          })

          // 注册html-webpack-plugin的afterEmit hooks，他是等html输出后触发（注意，不是打包输出后，而是html-webpack-plugin生成html后）
          hooks.afterEmit.tap('InlineChunkWebpackPlugin', () => {
            // 删除输出的runtime文件
            Object.keys(compilation.assets).forEach(filepath => {
                if(this.tests.some(test => test.test(filepath))) {
                    delete compilation.assets[filepath];
                }
            })
          })
          
        })
    }

    getInlineChunk(tags, compilation) {
      /*
      把这个： 
      [
        {
          tagName: 'script',
          voidTag: false,
          meta: { plugin: 'html-webpack-plugin' },
          attributes: { defer: true, type: undefined, src: 'js/runtime~main.js' }
        }
      ]
      转换成这个：
      [
        {
          tagName: 'script',
          innerHTML: runtime的内容
          closeTag: true
        }
      ]
      */
      return tags.map(tag => {
        if(tag.tagName !== 'script') return tag;
        // 获取文件资源路径
        const filepath = tag.attributes.src;
        if(!filepath) return tag;
        if(!this.tests.some(test => test.test(filepath))) return tag;
        return {
          tagName: 'script',
          innerHTML: compilation.assets[filepath].source(),
          closeTag: true
        }
      })
    }
}

module.exports = InlineChunkWebpackPlugin;