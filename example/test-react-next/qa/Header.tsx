import React from "react";
import style from "./index.module.css";

export type HeaderProps = {
    onArrowClick: () => void
    onValidation: () => void
}

function HeaderFunc(props: HeaderProps) {
    const { onArrowClick, onValidation } = props
    return (
        <div className={`${style["card-header"]} ${style["card-header-d-flex"]}`}>
            <div>Header</div>
            <div>
                <div onClick={onValidation} >Yes</div>
                <div className={style["close-card"]} onClick={onArrowClick}>
                    X
                </div>
            </div>

        </div>
    )
}

export const Header = React.memo(HeaderFunc)