export enum ParseMode {
    DOCUMENT,
    INLINE,
}

export default interface IParseOptions {
    debug: boolean;
    content: string;
    mode: ParseMode;
    fileLocation: string;
    idField: string;
}