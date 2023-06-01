import SourceLocation from '@photon-rush/not-another-markdown/source/core/SourceLocation';

export enum ParseErrorLevel {
    Info,
    Warning,
    Error,
}

export default class ParseMessage {
    private _text: string;
    private _level: ParseErrorLevel;
    private _location: SourceLocation;

    constructor(text: string, level: ParseErrorLevel = ParseErrorLevel.Info, location?: SourceLocation | null) {
        this._text = text;
        this._level = level;
        this._location = location = new SourceLocation(location);
    }

    get text() { return this._text; }

    get level() { return this._level; }

    get location() { return this._location; }
}