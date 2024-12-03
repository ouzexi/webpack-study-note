import React, { useEffect, useRef, useState } from "react";

function useClickOutSide(ref, cb) {

    const handleClickOutSide = (e) => {
        if(ref.current && ref.current !== e.target) {
            cb && cb()
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutSide);
        return () => {
            document.removeEventListener('click', handleClickOutSide);
        }
    }, [])
}

export default function About() {

    const [visible, setVisible] = useState(false)
    const btnRef = useRef(null)

    useClickOutSide(btnRef, () => {
        setVisible(false)
    })

    return (
        <div className="about">
            <button onClick={() => {setVisible(true)}} ref={btnRef}>打开弹窗</button>
            {
                visible && (<div>我是一个弹窗</div>)
            }
        </div>
    )
}