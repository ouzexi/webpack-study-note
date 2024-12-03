module.exports = function(content) {
    /* 
        1.直接使用style-loader，只能处理样式，不能处理样式中引入的其他资源如background-image: url(xx)
        use: ['style-loader']

        2.借助css-loader解决样式中引入的其他资源的问题
        use: ['style-loader', 'css-loader']

        问题是css-loader处理文件内容后暴露了一段js代码，style-loader需要先执行js代码得到返回值，再动态创建style标签插入到页面上不好操作
    */
}

// 3.style-loader使用picth loader用法
module.exports.pitch = function(remainingRequest) {
    // 1.将remainingRequest中绝对路径改成相对路径（因为后面的操作需要为相对路径）（remainingRequest是剩余还需要处理的loader）
    // 转换前：D:\webpack-study-loaders\node_modules\css-loader\dist\cjs.js!D:\webpack-study-loaders\src\css\index.css
    // 转换后： ../../node_modules/css-loader/dist/cjs.js!./index.css
    
    const relativePath = remainingRequest.split('!').map(absolutePath => {
        // this.utils.contextify返回一个相对路径
        // this.context是当前loader文件相对absolutePath的相对路径，注意this是当前loader的上下文，所以要用箭头函数
        return this.utils.contextify(this.context, absolutePath)
    }).join('!');
    
    // 2.引入css-loader处理后的资源（../../node_modules/css-loader/dist/cjs.js!./index.css就是执行内联loader，意思是使用css-loader处理index.css文件）
    // 3.动态创建style标签插入到页面中生效
    // import style from "!!${relativePath}";的!!是跳过pre、normal和post loader。因为css-loader默认会执行他们，所以要阻止
    const script = `
    import style from "!!${relativePath}";

    const styleEl = document.createElement('style')
    styleEl.innerHTML = style
    document.head.appendChild(styleEl)
    `

    // pitch方法return熔断，不会再执行后面的loader
    return script;
}