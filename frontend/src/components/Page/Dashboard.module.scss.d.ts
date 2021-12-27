import globalClassNames, { ClassNames as GlobalClassNames } from "....style.d";
declare const classNames: typeof globalClassNames & {
  readonly overflow: "overflow";
};
export default classNames;
export type ClassNames = "overflow" | GlobalClassNames;
