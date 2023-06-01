import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { ElementTransformer } from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import Result from '@photon-rush/results/source/Result';

export default class CommandElement extends ElementInstance {
    public name      : string;
    public parameters: Array<string>;

    constructor(name: string = '') {
        super(Elements.COMMAND);

        this.name       = name.trim();
        this.parameters = [];
    }

    simplify(): ISimpleElementData {
        return {
            name      : this.name,
            parameters: this.parameters,
        };
    }

    static recognize(input: TokenStream): boolean {
        return input.peek().type === Token.COMMAND_NAME;
    }

    static parse(input: TokenStream, name?: string): Result<CommandElement> {
        const result = new Result<CommandElement>();

        const nameActual: string = name ? name : input.next().value;

        const command = new CommandElement(nameActual);

        while (input.peek().type === Token.COMMAND_PARAMETER) {
            command.parameters.push(input.next().value);
        }

        result.value = command;

        return result;
    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name     : 'CommandElement',
            recognize: this.recognize,
            parse    : this.parse,
        });
    }
}