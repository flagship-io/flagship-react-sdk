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
  const onVariationSelected = (variation: Variation) => {
    if (props.onVariationSelected) {
        props.onVariationSelected({variationGroupId: data.id, variationId: variation.id })
    }
  };
  return (
    <>
      {data.variations.map((item) => {
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
