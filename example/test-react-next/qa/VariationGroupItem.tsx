import { useState } from "react";
import { VariationItem } from "./VariationItem";
import { Variation, VariationGroup } from "./type";

export type VariationGroupItemProps = {
    data: VariationGroup,
    onVariationSelected?:(arg:{
        variationGroupId:string,
        variationId: string
    })=>void
}

export function VariationGroupItem(props: VariationGroupItemProps) {
    const {data } = props
  const [variations, setVariations] = useState(data.variations);

  const onVariationSelected = (variation: Variation) => {
    setVariations((state) => {
      return state.map((value) => {
        value.isSelected = false;
        if (variation.id === value.id) {
          value.isSelected = true;
        }
        return value;
      });
    });
    if (props.onVariationSelected) {
        props.onVariationSelected({variationGroupId: data.id, variationId: variation.id })
    }
  };
  return (
    <>
      {variations.map((item, index) => {
        return (
          <VariationItem
            data={item}
            key={item.id}
            onVariationSelected={onVariationSelected}
          />
        );
      })}
    </>
  );
}
