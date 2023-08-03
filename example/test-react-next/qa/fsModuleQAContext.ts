import { createContext } from "react";
import { ExposedVariations } from "./type";

export type FsDataCard = {
    onVariationSelected: (forceVariation: ExposedVariations) => void
};

export const fsModuleQAContext = createContext<FsDataCard>({
  onVariationSelected: (variation: ExposedVariations) => {},
});