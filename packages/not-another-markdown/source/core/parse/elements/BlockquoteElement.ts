import { entry } from '@photon-rush/not-another-markdown/source/core';
import { ParseMode } from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { ElementTransformer } from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import Result from '@photon-rush/results/source/Result';

export default class BlockquoteElement extends ElementInstance {


    constructor() {
        super(Elements.BLOCK_QUOTE);
    }

    simplify(): ISimpleElementData {
        return {};
    }

    static recognize(input: TokenStream): boolean {
        return input.peek().type === Token.BLOCK_QUOTE;
    }

    static parse(input: TokenStream): Result<BlockquoteElement> {
        const element = new BlockquoteElement();
        const result  = new Result<BlockquoteElement>(element);

        let content = '';

        while (input.peek().type === Token.BLOCK_QUOTE) {
            content = `${content}\n${input.next().value}`;
        }

        const elements = result.extract(entry({
            mode: ParseMode.INLINE,
            content,
        }));

        if (elements) elements.forEach(e => element.add(e));

        return result;
    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name     : 'BlockquoteElement',
            recognize: this.recognize,
            parse    : this.parse,
        });
    }
}