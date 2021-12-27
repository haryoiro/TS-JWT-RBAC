import globalClassNames, { ClassNames as GlobalClassNames } from "..style.d";
declare const classNames: typeof globalClassNames & {
  readonly "max-width": "max-width";
  readonly table: "table";
  readonly scroll: "scroll";
};
export default classNames;
export type ClassNames = "max-width" | "table" | "scroll" | GlobalClassNames;
