import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import {ElementTransformer} from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import Result from '@photon-rush/results/source/Result';

export default class HeadingElement extends ElementInstance {
    public text: string;
    public level: number;

    constructor(level: number = 1, text: string = '') {
        super(Elements.HEADING);

        this.text = text.trim();
        this.level = level;
    }

    simplify(): ISimpleElementData {
        return {
            text: this.text,
            level: this.level,
        };
    }

    static recognize(input: TokenStream): boolean {
        return input.matchOne([
            Token.HEADING1,
            Token.HEADING2,
            Token.HEADING3,
            Token.HEADING4,
            Token.HEADING5,
            Token.HEADING6,
        ]);
    }

    static parse(input: TokenStream): Result<HeadingElement> {
        const result = new Result<HeadingElement>();
        const token = input.next();

        const level = ((type: Token) => {
            switch (type) {
                case Token.HEADING1:
                    return 1;
                case Token.HEADING2:
                    return 2;
                case Token.HEADING3:
                    return 3;
                case Token.HEADING4:
                    return 4;
                case Token.HEADING5:
                    return 5;
                case Token.HEADING6:
                    return 6;
            }
        })(token.type);

        result.value = new HeadingElement(level, token.value);

        return result;
    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name: 'HeadingElement',
            recognize: this.recognize,
            parse: this.parse,
        });
    }
}