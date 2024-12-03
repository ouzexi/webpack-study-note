## 通过node调试compiler和compilation对象

在package.json编写脚本命令 "debug": "node --inspect-brk ./node_modules/webpack-cli/bin/cli.js"

node 表示启动node执行
--inspect-brk 是在程序第一行打一个断点，意思是程序一执行立马暂停以供调试
./node_modules/webpack-cli/bin/cli.js 可以理解为执行webpack，就会调用wepback.confog.js

在apply(compiler)一行打上断点(写个debugger)，执行npm run debug
打开浏览器控制台，可以看到有一个绿色的node标志，点击打开就能看到源代码调试
F8继续执行脚本，就能跳到apply(compiler)一行，就能看到compiler对象有什么属性，compilation对象类似