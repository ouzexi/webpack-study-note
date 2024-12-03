在package.json中的scripts配置中，serve的命令webpack serve不需要npx了，
因为他会自动把node_modules下的.bin目录加入到环境变量

"browserslist": ["last 2 version", "> 1%", "not dead"]
package.json中browserslist是用于配置postcss处理兼容的版本,还会影响@babel/preset-env默认预设打包产物
比如如果兼容ie，那么babel打包的会把箭头函数等语法转化为普通函数，不考虑ie时会直接使用箭头函数
last 2 version表示浏览器的最后2个版本，>1%是市场占有率>1%的，not dead是还在维护的