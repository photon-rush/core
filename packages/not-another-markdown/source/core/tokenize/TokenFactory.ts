import CharacterStream from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import {TokenTransformer} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenTransformer';
import Result from '@photon-rush/results/source/Result';
import VResult from '@photon-rush/results/source/VResult';


export default class TokenFactory {
    private _input: CharacterStream;
    private _output: VResult<Array<TokenInstance>>;

    private _transformers: Array<TokenTransformer>;

    private _textAggregator: TokenInstance | null = null;


    constructor(characterStream: CharacterStream, transformers: Array<TokenTransformer>) {
        this._input = characterStream;

        this._output = new VResult<Array<TokenInstance>>([]);
        this._output.value.push(this.createToken(Token.START));

        this._transformers = transformers;
    }

    get done() { return this._input.done; }

    get notDone() { return this._input.notDone; }

    get hasErrors() { return this._output.errorCount > 0; }

    get tokens(): ReadonlyArray<TokenInstance> { return this._output.value; } // TODO: Actual Readonly
    get lastToken(): TokenInstance {
        if (this._textAggregator) return this._textAggregator;

        return this._output.value[this._output.value.length - 1];
    }

    private _addText() {
        if (!this._textAggregator) {
            this._textAggregator = this.createToken(Token.TEXT);
        }

        this._textAggregator.value += this._input.next();
    }

    private _hasText(): boolean {
        if (!this._textAggregator) return false;

        return !!this._textAggregator.value;
    }

    createToken(type: Token, value: string = ''): TokenInstance {
        return new TokenInstance(type, value, this._input.getSourceLocation());
    }

    createCommand(name: string, args: Array<string> = []): Array<TokenInstance> {
        const result: Array<TokenInstance> = [];

        const nameToken = this.createToken(Token.COMMAND_NAME);
        nameToken.value = name.trim();
        result.push(nameToken);

        args.forEach(arg => {
            result.push(this.createToken(Token.COMMAND_PARAMETER, arg.trim()));
        });

        return result;
    }

    next() {
        const result = new Result<Array<TokenInstance>>();
        const options = this._transformers.filter(tk => tk.recognize(this._input, this)); //TODO: create actual readonly proxy

        if (options.length === 0) {
            this._addText();
        } else if (options.length > 1) {
            const tokens = options.map(t => t.name).join(', ');

            result.add({
                level: 'error',
                text: `${this._input.getSourceLocation()} Ambiguous tokens! "${tokens}"`,
                source: 'tokenFactory',
            });
        } else {
            if (this._textAggregator) {
                this._output.value.push(this._textAggregator);

                this._textAggregator = null;
            }

            const tokens = result.extract(options[0].parse(this._input, this));
            this._output.extract(result);

            if (tokens) this._output.value.push(...tokens);
        }

        return this.notDone;
    }

    nextPhrase(transformers: Array<TokenTransformer>): Result<Array<TokenInstance>> {
        const result = new Result<Array<TokenInstance>>();

        if (this._hasText()) {
            result.add({
                level: 'error',
                text: 'Cannot add a phrase element because there is text on the stack.',
                source: 'TokenFactory',
            });

            return result;
        }


        const tokens: Array<TokenInstance> = [];
        result.value = tokens;

        while (this.notDone) {
            if (this._input.peek() === '\n') break;

            const options = transformers.filter(tk => tk.recognize(this._input, this));

            if (options.length === 0) {
                this._addText();
            } else if (options.length > 1) {
                const tokens = options.map(t => t.name).join(', ');

                throw new Error(`${this._input.getSourceLocation()} Ambiguous tokens! "${tokens}"`);
            } else {
                if (this._textAggregator) {
                    tokens.push(this._textAggregator);

                    this._textAggregator = null;
                }

                const nextTokens = result.extract(options[0].parse(this._input, this));

                if (nextTokens) tokens.push(...nextTokens);
            }
        }

        if (this._textAggregator) {
            tokens.push(this._textAggregator);

            this._textAggregator = null;
        }

        return result;
    }

    complete() {
        if (this._textAggregator) {
            this._output.value.push(this._textAggregator);

            this._textAggregator = null;
        }
    }
}