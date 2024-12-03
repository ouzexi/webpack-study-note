import { sum } from './math'
console.log('Hello Main')
console.log(sum(1, 2, 3, 4))

document.getElementById('btn').onclick = function() {  // 动态加载，一开始首页不加载，当点击按钮时才加载
    import('./count').then(res => {
        console.log("模块加载成功", res.default(3, 1))  // 动态加载模块，因为是export default，所以default()才是导出的变量
    }).catch((err) => {
        console.log("模块加载失败", err)
    })
}