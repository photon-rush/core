import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import {ElementTransformer} from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import parseText from '@photon-rush/not-another-markdown/source/core/parse/elementTransformers/parseText';
import Result from '@photon-rush/results/source/Result';


export default class ParagraphElement extends ElementInstance {
    constructor() {
        super(Elements.PARAGRAPH);
    }

    simplify(): ISimpleElementData {
        return {};
    }

    static recognize(input: TokenStream): boolean {
        return input.matchOne([Token.TEXT, Token.EMPHASIS, Token.STRONG, Token.PRE]);
    }

    static parse(input: TokenStream): Result<ParagraphElement> {
        return parseText(input, new ParagraphElement());
    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name: 'ParagraphElement',
            recognize: this.recognize,
            parse: this.parse,
        });
    }
}