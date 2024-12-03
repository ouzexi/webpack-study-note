import './css/index.css'

console.log("hello main1")
console.log("hello main2")
console.log("hello main3")

function sum(...args) {
    return args.reduce((p, c) => p+c, 0)
}