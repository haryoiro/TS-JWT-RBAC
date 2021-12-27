import globalClassNames, { ClassNames as GlobalClassNames } from "./style.d";
declare const classNames: typeof globalClassNames & {
  readonly App: "App";
  readonly "App-logo": "App-logo";
  readonly "App-header": "App-header";
  readonly "App-link": "App-link";
};
export default classNames;
export type ClassNames =
  | "App"
  | "App-logo"
  | "App-header"
  | "App-link"
  | GlobalClassNames;
