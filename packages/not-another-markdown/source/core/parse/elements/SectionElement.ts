import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { ElementTransformer } from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';

export default class SectionElement extends ElementInstance {
    public name: string;

    constructor(name: string = '') {
        super(Elements.SECTION);

        this.name = name.toLowerCase().trim();
    }

    simplify(): ISimpleElementData {
        return {
            name: this.name,
        };
    }

    static recognize(input: TokenStream): boolean {
        return input.match([
            Token.HORIZONTAL_RULE,
            Token.LINE_BREAK,
            Token.HEADING1,
            Token.LINE_BREAK,
            Token.HORIZONTAL_RULE,
            Token.LINE_BREAK,
        ]);
    }

    static parse(input: TokenStream): SectionElement {
        input.next(); // Token.HORIZONTAL_RULE,
        input.next(); // Token.LINE_BREAK,
        const heading = input.next(); // Token.HEADING1,
        input.next(); // Token.LINE_BREAK,
        input.next(); // Token.HORIZONTAL_RULE,
        input.next(); // Token.LINE_BREAK,

        return new SectionElement(heading.value);
    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name     : 'SectionElement',
            recognize: this.recognize,
            parse    : this.parse,
        });
    }
}