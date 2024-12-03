/* 
    1. webpack加载webpack.config.js中所有配置，此时就会new TestPlugin()，执行插件的constructor
    2. webpack创建complier对象，每次webpack构建项目只会全局创建一个compiler对象
    3. 遍历所有plugins中插件，调用插件的apply方法
    4. 执行剩下的编译流程（触发各个hooks事件）
*/

class TestPlugin {
    constructor() {
        console.log("TestPlugin constructor")
    }

    apply(compiler) {
        debugger
        console.log("TestPlugin apply")

        // compiler钩子第一个参数是插件的名称，所以为TestPlugin

        // 因为environment钩子是同步方法（SyncHook），所以只能用tap触发
        // https://webpack.docschina.org/api/compiler-hooks/#environment
        compiler.hooks.environment.tap('TestPlugin', () => {
            console.log("TestPlugin environment")
        })
        
        // emit是异步串行钩子，意思是等1执行完再执行2，等2执行完再执行3
        // emit是异步方法（AsyncSeriesHook），所以可以用tap，tapAsync和tapPromise触发
        // https://webpack.docschina.org/api/compiler-hooks/#emit
        compiler.hooks.emit.tap('TestPlugin', (compilation) => {
            /* setTimeout(() => {
                console.log("TestPlugin emit 1")
            }, 2000) */
            console.log("TestPlugin emit 1")
        })
        compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
            setTimeout(() => {
                console.log("TestPlugin emit 2")
                // 调用callback结束执行
                callback()
            }, 1000)
        })
        compiler.hooks.emit.tapPromise('TestPlugin', (compilation) => {
            // 返回Promise对象结束执行
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log("TestPlugin emit 3")
                    resolve()
                })
            }, 3000)
        })

        // make是异步并行钩子，多个make钩子同时触发，执行完毕的快慢取决于异步操作的执行完毕顺序
        // 下面顺序就是 1 -> 3 -> 2
        compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {

            // 因为在compiler.make钩子后且compiler.afterEmit钩子前才执行compilation钩子，所以要保证再该时机编写compilation钩子事件
            // 而且他是再所以make钩子执行完后再执行
            // https://yk2012.github.io/sgg_webpack5/origin/plugin.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E7%AE%80%E5%9B%BE
            compilation.hooks.seal.tap('TestPlugin', () => {
                console.log("TestPlugin seal")
            })

            setTimeout(() => {
                console.log("TestPlugin make 1")
                callback()
            }, 1000)
        });
        compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
            setTimeout(() => {
                console.log("TestPlugin make 2")
                callback()
            }, 3000)
        });
        compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
            setTimeout(() => {
                console.log("TestPlugin make 3")
                callback()
            }, 2000)
        });
    }
}

module.exports = TestPlugin;