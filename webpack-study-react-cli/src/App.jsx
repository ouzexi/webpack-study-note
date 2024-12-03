import React, { Suspense, lazy } from "react"
import { Link, Routes, Route } from 'react-router-dom'
import { Button } from 'antd'

// import Home from "./pages/Home"
// import About from "./pages/About"

// 路由懒加载
const Home = lazy(() => import(/* webpackChunkName: "home-route" */ './pages/Home')) // 在控制台-源代码-加载home页面时会加载main-route.chunk.js
const About = lazy(() => import(/* webpackChunkName: "about-route" */ './pages/About'))

export default function App() {
    return (
        <>
        <h1>React</h1>
        <Button type="primary">按钮</Button>
        <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">About</Link></li>
        </ul>
        <Suspense fallback={<h1>Loading...</h1>}>
            <Routes>
                <Route path="/home" element={<Home/>}></Route>
                <Route path="/about" element={<About/>}></Route>
            </Routes>
        </Suspense>
        </>
    )
}