import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import {ElementTransformer} from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import parseList from '@photon-rush/not-another-markdown/source/core/parse/elementTransformers/parseList';
import Result from '@photon-rush/results/source/Result';


export default class OrderedListElement extends ElementInstance {

    constructor() {
        super(Elements.ORDERED_LIST);
    }

    simplify(): ISimpleElementData {
        return {};
    }

    static recognize(input: TokenStream): boolean {
        return input.peek().type === Token.ORDERED_LIST;
    }

    static parse(input: TokenStream): Result<OrderedListElement> {
        return parseList(input);
    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name: 'OrderedListElement',
            recognize: this.recognize,
            parse: this.parse,
        });
    }
}