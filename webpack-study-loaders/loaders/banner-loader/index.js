const schema = require('./schema.json');

// 给代码加上作者
module.exports = function(content) {
    const options = this.getOptions(schema)
    const prefix = `
    /*
    *   Author: ${options.author}
    */
    `
    return prefix + content;
}

// this.getOptions(schame)是获取loader传递的options
// schema是对options的验证规则
// schema符合JSON Schema的规则
/* {
    "type": "object",           // 这句意思是schema是一个对象类型
    "options": {                // 这句意思是有什么选项
        "author": {             // 这句意思是配置一个author选项
            "type": "string"    // 这句意思是author是字符串类型
        }
    },
    "additionalOptions": false  // 这句意思是不可以增加其他的选项，只能有一个author选项
} */