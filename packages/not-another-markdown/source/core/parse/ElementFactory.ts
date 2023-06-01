import ElementInstance, { Elements } from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { ElementTransformer } from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import Result from '@photon-rush/results/source/Result';
import VResult from '@photon-rush/results/source/VResult';

export default class ElementFactory {
    private _input  : TokenStream;
    private _output : VResult<Array<ElementInstance>>;
    private _unknown: Array<TokenInstance>;

    private _transformers: Array<ElementTransformer>;

    constructor(input: TokenStream, transformers: Array<ElementTransformer>) {
        this._input   = input;
        this._output  = new VResult<Array<ElementInstance>>([]);
        this._unknown = [];

        this._transformers = transformers;

        if (input.peek().type === Token.START) {
            input.next();
        }
    }

    get done() { return this._input.done; }

    get notDone() { return this._input.notDone; }

    get elements(): ReadonlyArray<ElementInstance> { return this._output.value; } // TODO: Actual Readonly
    get unknown(): ReadonlyArray<TokenInstance> { return this._unknown; } // TODO: Actual Readonly


    next() {
        const result = new Result<ElementInstance>();

        const options = this._transformers.filter(tk => tk.recognize(this._input)); //TODO: create actual readonly proxy


        if (options.length === 0) {
            result.add({
                level: 'warning',
                text : `${this._input.position.toString()
                    .padStart(4, '0')} No element transformer! ${this._input.peek()}`,
                source: 'ElementFactory',
            });

            // console.log(result.messages[result.messages.length - 1].text);

            this._unknown.push(this._input.next());
        } else if (options.length > 1) {
            const transformerList = options.map(t => t.name)
                .join(', ');

            result.add({
                level: 'error',
                text : `${this._input.position.toString()
                    .padStart(4, '0')} Ambiguous element transformers! ${this._input.peek().type}: ${transformerList}`,
                source: 'ElementFactory',
            });

            // console.log(result.messages[result.messages.length - 1].text);
        } else {
            const element = result.extract(options[0].parse(this._input));
            this._output.extract(result);

            if (element) {
                if (element.type === Elements.DOCUMENT) {
                    result.add({
                        level : 'error',
                        text  : 'ElementFactory cannot handle Documents',
                        source: 'ElementFactory',
                    });
                } else if (element.type === Elements.SECTION) {
                    result.add({
                        level : 'error',
                        text  : 'ElementFactory cannot handle Sections',
                        source: 'ElementFactory',
                    });
                } else {
                    this._output.value.push(element);
                }
            }
        }

        return this.notDone;
    }
}