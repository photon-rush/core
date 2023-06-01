import { entry } from '@photon-rush/not-another-markdown/source/core';
import { ParseMode } from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { ElementTransformer } from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';

export default class CalloutElement extends ElementInstance {

    constructor() {
        super(Elements.CALLOUT);
    }

    simplify(): ISimpleElementData {
        return {};
    }

    static recognize(input: TokenStream): boolean {
        return input.peek().type === Token.CALLOUT;
    }

    static parse(input: TokenStream): CalloutElement {
        const element = new CalloutElement();

        let content = '';

        while (input.peek().type === Token.CALLOUT) {
            content = `${content}\n${input.next().value}`;
        }

        const elements = entry({
            mode: ParseMode.INLINE,
            content,
        }).elements;

        if (elements) elements.forEach(e => element.add(e));

        return element;
    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name     : 'CalloutElement',
            recognize: this.recognize,
            parse    : this.parse,
        });
    }
}