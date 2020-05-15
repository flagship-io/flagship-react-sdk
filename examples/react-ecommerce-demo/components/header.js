import dynamic from "next/dynamic";
import { view } from "@risingstack/react-easy-state";

const FSWrapper = dynamic(() => import("./fsWrapper"), { ssr: false });

import HeaderInner from "./headerInner";

export default view(({ cartObj, fsFlags, fsInfos }) => {
  return (
    <FSWrapper fsInfos={fsInfos}>
      <HeaderInner cartObj={cartObj} />
    </FSWrapper>
  );
});
