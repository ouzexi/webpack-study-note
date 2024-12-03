import count from "./js/count";
import sum from "./js/sum";
// import { mul } from './js/math' // 改成动态导入
// import 'core-js/es/promise' // 完整引入，打包后会生成一个单独的chunk，因为splitChunks的默认配置cacheGroups中node_modules中的模块会被打包成单独的chunk

// 引入css
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./stylus/index.styl";
// 引入iconfont
import "./css/iconfont.css";

document.getElementById("btn").onclick = function () {
  // /* webpackChunkName: "math" */是webpack魔法命名，将动态打包出来的js文件命名为math，但是还要配置webpack.config.js的output的chunkFilename
  import(/* webpackChunkName: "math" */ "./js/math").then(({ mul }) => {
    console.log(mul(3, 3));
  });
};
// var result = count(2, 1)
const result = count(2, 1);
console.log(result);
console.log(sum(1, 2, 3, 4));

// 因为开发环境的配置文件，css有style-loader处理，所以style-loader会自动开启HMR
// 但是js是不会开启HMR的，所以在hot: true的前提下还要自己做处理
// 判断module.hot是不是开启的，如果是，把需要开启HMR的js文件用accept包裹
if (module.hot) {
  module.hot.accept("./js/count");
  module.hot.accept("./js/sum");
}

new Promise((resolve) => {
  setTimeout(() => {
    resolve("test promise");
  }, 1000);
}).then((res) => {
  console.log("🚀 ~ file: main.js:38 ~ newPromise ~ res:", res);
});

const arr = [1, 2, 3];
console.log(arr.includes(2));

// 配置service workers
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
    // 会在打包目录下生成service-worker.js,成功后可以在浏览器应用service workers查看，资源是存在Cache -> cache storage(储存->缓存空间)
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
