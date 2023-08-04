import React, { useRef, useState } from "react";
import style from "./index.module.css";

export type InputSearchProps = {
    onChange:(text:string)=>void
}

function InputSearchFunc(props:InputSearchProps) {
    const {onChange} = props
    const [search, setSearch] = useState("")
    const timeoutId = useRef<any>()
    return (
        <input className={style["input-search"]} type="search" placeholder="search" value={search} onChange={(e)=>{
            const text = e.currentTarget.value
            setSearch(text)
            clearTimeout(timeoutId.current)
            timeoutId.current = setTimeout(()=>{
                onChange(text)
            }, 500)
        }} />
    )
}

export const InputSearch = React.memo(InputSearchFunc)