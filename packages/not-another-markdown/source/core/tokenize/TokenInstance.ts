import SourceLocation from '@photon-rush/not-another-markdown/source/core/SourceLocation';
import ISourceLocation from '@photon-rush/not-another-markdown/source/core/SourceLocation';

export enum Token {
    START = 'start',
    END = 'end',

    UNKNOWN = 'unknown',
    NONE = 'none',

    TEXT = 'text',
    LINE_BREAK = 'lineBreak',
    HORIZONTAL_RULE = 'horizontalRule',

    HEADING = 'heading',
    HEADING1 = 'h1',
    HEADING2 = 'h2',
    HEADING3 = 'h3',
    HEADING4 = 'h4',
    HEADING5 = 'h5',
    HEADING6 = 'h6',

    ORDERED_LIST = 'orderedList',
    UNORDERED_LIST = 'unorderedList',
    LIST_INDENT = 'listIndent',
    LIST_TERM_DIVIDER = 'listTermDivider',

    CODE_START = 'codeStart',
    CODE_LINE = 'codeLine',
    BLOCK_QUOTE = 'blockQuote',
    CALLOUT = 'callout',

    TABLE = 'table',
    TABLE_CELL = 'tableCell',
    TABLE_ROW = 'tableRow',
    TABLE_DIVIDER = 'tableDivider',

    STRONG = 'strong',
    EMPHASIS = 'emphasis',
    PRE = 'pre',

    COMMAND = 'command',
    COMMAND_NAME = 'commandName',
    COMMAND_PARAMETER = 'commandParameter',

    LINK = 'link',
    IMAGE = 'image',

}

export interface IToken {
    type: Token;
    value: string;

    file: string;
    line: number;
    column: number;
}

export default class TokenInstance {
    private _type: Token;

    public value: string;
    public location: SourceLocation;


    constructor(type: Token = Token.NONE, value?: string | null, location?: ISourceLocation | null) {
        this._type = type || Token.NONE;
        this.value = value || '';
        this.location = new SourceLocation(location);
    }

    get type() { return this._type; }

    get beginning() { return TokenInstance.isBeginning(this.type); }

    toString(includeFile: boolean = false, truncate?: number): string {
        const location = this.location.toString(includeFile);
        const type = this.type.padStart(20);
        const cut = typeof truncate === 'undefined' ? this.value : this.value.slice(0, truncate);
        const value = cut.replaceAll('\n', '\\n');

        return `${location} ${type} |> ${value}`;
    }

    static isBeginning(token: Token): boolean {
        return token === Token.START
            || token === Token.LINE_BREAK
            || token === Token.BLOCK_QUOTE
            || token === Token.CALLOUT
            ;
    }
}