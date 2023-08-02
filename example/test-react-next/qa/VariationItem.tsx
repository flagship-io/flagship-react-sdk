import React from "react";
import { Variation } from "./type";

export type VariationItemProps ={
    data:Variation,
    onVariationSelected(item:Variation):void
}

function VariationItemFunc(props:VariationItemProps){
    const { data } = props
    const onVariationSelected = ()=>{
        props.onVariationSelected(props.data)
    }

    return (
        <div>
            <div>variation name {data.id} <input type="radio" checked={!!data.isSelected} onChange={onVariationSelected}  /></div>
            <pre>{JSON.stringify(data.modifications.value,null, 4)}</pre>
        </div>
    )
}

export const VariationItem = React.memo(VariationItemFunc)