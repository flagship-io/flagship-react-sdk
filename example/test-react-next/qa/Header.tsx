import React, { useCallback } from "react";
import style from "./index.module.css";
import { InputSearch } from "./InputSearch";

export type HeaderProps = {
    onArrowClick: () => void
    onValidation: () => void
    onSearchInputChange: (text:string)=>void
}

const crossImg = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzYgMzYiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzYgMzYiPjxnIGlkPSJpY29ucyI+PHBhdGggZD0iTTYuMiAzLjUgMy41IDYuMmMtLjcuNy0uNyAxLjkgMCAyLjdsOS4yIDkuMi05LjIgOS4yYy0uNy43LS43IDEuOSAwIDIuN2wyLjYgMi42Yy43LjcgMS45LjcgMi43IDBsOS4yLTkuMiA5LjIgOS4yYy43LjcgMS45LjcgMi43IDBsMi42LTIuNmMuNy0uNy43LTEuOSAwLTIuN0wyMy4zIDE4bDkuMi05LjJjLjctLjcuNy0xLjkgMC0yLjdsLTIuNi0yLjZjLS43LS43LTEuOS0uNy0yLjcgMEwxOCAxMi43IDguOCAzLjVjLS43LS43LTEuOS0uNy0yLjYgMHoiIGlkPSJjbG9zZV8xXyIgZmlsbD0iI2ZmZmZmZiIgY2xhc3M9ImZpbGwtMjIyYTMwIj48L3BhdGg+PC9nPjwvc3ZnPg=='
const checkedImg = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTczLjg5OCA0MzkuNDA0LTE2Ni40LTE2Ni40Yy05Ljk5Ny05Ljk5Ny05Ljk5Ny0yNi4yMDYgMC0zNi4yMDRsMzYuMjAzLTM2LjIwNGM5Ljk5Ny05Ljk5OCAyNi4yMDctOS45OTggMzYuMjA0IDBMMTkyIDMxMi42OSA0MzIuMDk1IDcyLjU5NmM5Ljk5Ny05Ljk5NyAyNi4yMDctOS45OTcgMzYuMjA0IDBsMzYuMjAzIDM2LjIwNGM5Ljk5NyA5Ljk5NyA5Ljk5NyAyNi4yMDYgMCAzNi4yMDRsLTI5NC40IDI5NC40MDFjLTkuOTk4IDkuOTk3LTI2LjIwNyA5Ljk5Ny0zNi4yMDQtLjAwMXoiIGZpbGw9IiNmZmZmZmYiIGNsYXNzPSJmaWxsLTAwMDAwMCI+PC9wYXRoPjwvc3ZnPg=='
function HeaderFunc(props: HeaderProps) {
    const { onArrowClick, onValidation } = props
    const onSearchInputChange = useCallback((value:string)=>{
        props.onSearchInputChange(value)
    },[])
    return (
        <div className={`${style["card-header"]} ${style["card-header-d-flex"]}`}>
            <div><span>Flagship </span> <InputSearch onChange={onSearchInputChange}/> </div>
            <div className={style['btn-container']}>
                <div className={style["validation-btn"]} onClick={onValidation} >
                <img src={checkedImg} alt="checked"  />
                </div>
                <div className={style["close-card"]} onClick={onArrowClick}>
                    <img src={crossImg} alt="cross"  />
                </div>
            </div>

        </div>
    )
}

export const Header = React.memo(HeaderFunc)