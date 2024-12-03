import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import 'antd/dist/antd.less' // 这里引入andt的样式一定要less，因为修改全局样式比如主题颜色就是通过less配置的(注意：是4版本！！)

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)