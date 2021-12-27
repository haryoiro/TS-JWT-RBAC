export declare const cssLangs = "\\.(css|sass|scss)($|\\?)";
export declare const cssLangReg: RegExp;
export declare const isCSSRequest: (request: string) => boolean;
export declare const getRelativePath: (from: string | undefined, to: string | undefined) => string;
export declare const toDashCase: (target: string) => string;
export declare const toCamelCase: (target: string) => string;
