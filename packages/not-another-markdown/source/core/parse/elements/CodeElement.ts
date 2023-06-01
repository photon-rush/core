import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import {ElementTransformer} from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import Result from '@photon-rush/results/source/Result';

export default class CodeElement extends ElementInstance {
    public text: string;
    public language: string;

    constructor(language: string = '', text: string = '') {
        super(Elements.CODE);

        this.text = text.trim();
        this.language = language;
    }

    simplify(): ISimpleElementData {
        return {
            language: this.language,
            text: this.text,
        };
    }

    static recognize(input: TokenStream): boolean {
        return input.peek().type === Token.CODE_START;
    }

    static parse(input: TokenStream): Result<CodeElement> {
        const result = new Result<CodeElement>();

        const start = input.next();

        let text = '';

        while (input.peek().type === Token.CODE_LINE) {
            text = `${text}\n${input.next().value}`;
        }

        result.value = new CodeElement(start.value, text);

        return result;
    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name: 'CodeElement',
            recognize: this.recognize,
            parse: this.parse,
        });
    }
}