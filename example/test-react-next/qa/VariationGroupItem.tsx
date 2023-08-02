import { useState } from "react"
import { VariationItem } from "./VariationItem"
import { Variation, VariationGroup } from "./type"

export function VariationGroupItem({data}:{data:VariationGroup}){
    const [variations, setVariations] = useState(data.variations)
    const onVariationSelected = (item:Variation)=>{
        setVariations(state=>{
            return state.map(value=>{
                value.isSelected = false
                if (item.id === value.id) {
                    value.isSelected = true
                }
                return value
            })
        })
    }
    return (
        <>
            {variations.map((item, index)=>{
                return <VariationItem data={item} key={index} onVariationSelected={onVariationSelected} />
            })}
        </>
    )
}
