import globalClassNames, { ClassNames as GlobalClassNames } from "..style.d";
declare const classNames: typeof globalClassNames & {
  readonly calendar: "calendar";
  readonly bg: "bg";
  readonly table: "table";
  readonly th: "th";
  readonly td: "td";
  readonly active: "active";
  readonly today: "today";
  readonly "another-month": "another-month";
  readonly selectme: "selectme";
  readonly "arrow-button": "arrow-button";
  readonly "chakra-select__icon-wrapper": "chakra-select__icon-wrapper";
};
export default classNames;
export type ClassNames =
  | "calendar"
  | "bg"
  | "table"
  | "th"
  | "td"
  | "active"
  | "today"
  | "another-month"
  | "selectme"
  | "arrow-button"
  | "chakra-select__icon-wrapper"
  | GlobalClassNames;
