import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

export type RecognizerFn = (input: IReadonlyCharacterStream, tokenFactory: TokenFactory) => boolean;
export type ParserFn = (input: CharacterStream, tokenFactory: TokenFactory) => Array<TokenInstance>;

export interface ITokenTransformer {
    get name(): string,

    recognize: RecognizerFn,
    parse    : ParserFn,
}

export class TokenTransformer implements ITokenTransformer {
    private _name     : string;
    private _recognize: RecognizerFn;
    private _parse    : ParserFn;

    constructor(name: string, recognize: RecognizerFn, parse: ParserFn) {
        this._name      = name;
        this._recognize = recognize;
        this._parse     = parse;
    }

    get name() { return this._name; }

    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        return this._recognize(input, tokenFactory);
    }

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        return this._parse(input, tokenFactory);
    }

    static fromObject(tokenTransformer: ITokenTransformer) {
        return new TokenTransformer(tokenTransformer.name, tokenTransformer.recognize, tokenTransformer.parse);
    }

    static fromArray(array: Array<ITokenTransformer>): Array<TokenTransformer> {
        return array.map(tk => this.fromObject(tk));
    }
}