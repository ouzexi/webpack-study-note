import { createApp } from 'vue'
import App from './App'

import router from './router'

// import(/* webpackChunkName: "test" */ './test').then(res => {
//     console.log("res.default(1, 2, 3, 4)", res.default(1, 2, 3, 4))
// })

const app = createApp(App)
app.use(router).mount(document.getElementById('app'))