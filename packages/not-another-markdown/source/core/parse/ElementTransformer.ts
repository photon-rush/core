import ElementInstance from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import Result from '@photon-rush/results/source/Result';

export type RecognizerFn = (input: TokenStream) => boolean;
export type ParserFn = (input: TokenStream) => Result<ElementInstance>;

export interface IElementTransformer {
    get name(): string;

    recognize: RecognizerFn;
    parse: ParserFn;
}

export class ElementTransformer {
    private _name: string;
    private _recognize: RecognizerFn;
    private _parse: ParserFn;

    constructor(name: string, recognize: RecognizerFn, parse: ParserFn) {
        this._name = name;
        this._recognize = recognize;
        this._parse = parse;
    }

    get name() { return this._name; }

    recognize(input: TokenStream): boolean {
        return this._recognize(input);
    }

    parse(input: TokenStream): Result<ElementInstance> {
        return this._parse(input);
    }

    static fromObject(elementTransformer: IElementTransformer) {
        return new ElementTransformer(elementTransformer.name, elementTransformer.recognize, elementTransformer.parse);
    }
}