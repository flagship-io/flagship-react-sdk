import React, { useContext } from "react";
import { Variation } from "./type";
import style from "./index.module.css";
import { fsModuleQAContext } from "./fsModuleQAContext";

export type VariationItemProps = {
  data: Variation;
  onVariationSelected(item: Variation): void;
};

function VariationItemFunc(props: VariationItemProps) {
  const { data } = props;  
  const onVariationSelected = () => {
    props.onVariationSelected(props.data);
  };
  return (
    <div className={`${style.variationItem} ${data.isOriginal?style['original-variationItem']:""}`}>
      <div>
        <div>variation name {data.id} {data.isOriginal? `[${data.allocation}]`:""}</div>
        <pre>{JSON.stringify(data.modifications.value, null, 4)}</pre>
      </div>
      <label className="container">
        <input
          type="radio"
          checked={!!data.isSelected}
          onChange={onVariationSelected}
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
}

export const VariationItem = React.memo(VariationItemFunc);
