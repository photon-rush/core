import ElementInstance, { Elements } from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { ElementTransformer } from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import Status from '@photon-rush/general/lib/Status';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';

export default class ElementFactory {
    private _input  : TokenStream;
    private _output : Array<ElementInstance>;
    private _unknown: Array<TokenInstance>;
    private _status : StatusCollection;

    private _transformers: Array<ElementTransformer>;

    constructor(input: TokenStream, transformers: Array<ElementTransformer>) {
        this._input   = input;
        this._output  = [];
        this._unknown = [];
        this._status  = new StatusCollection();

        this._transformers = transformers;

        if (input.peek().type === Token.START) {
            input.next();
        }
    }

    get done() { return this._input.done; }

    get notDone() { return this._input.notDone; }

    get elements(): ReadonlyArray<ElementInstance> { return this._output; } // TODO: Actual Readonly
    get unknown(): ReadonlyArray<TokenInstance> { return this._unknown; } // TODO: Actual Readonly

    next() {
        const options = this._transformers.filter(tk => tk.recognize(this._input)); //TODO: create actual readonly proxy


        if (options.length === 0) {
            this._status.add(Status.warn({
                message: `${this._input.position.toString().padStart(4, '0')} No element transformer! ${this._input.peek()}`,
                source : 'ElementFactory',
            }));

            // console.log(result.messages[result.messages.length - 1].text);

            this._unknown.push(this._input.next());
        } else if (options.length > 1) {
            const transformerList = options.map(t => t.name)
                .join(', ');

            this._status.add(Status.error({
                message: `${this._input.position.toString().padStart(4, '0')} Ambiguous element transformers! ${this._input.peek().type}: ${transformerList}`,
                source : 'ElementFactory',
            }));

            // console.log(result.messages[result.messages.length - 1].text);
        } else {
            const element = options[0].parse(this._input);

            if (element) {
                if (element.type === Elements.DOCUMENT) {
                    this._status.add(Status.error({
                        message: 'ElementFactory cannot handle Documents',
                        source : 'ElementFactory',
                    }));
                } else if (element.type === Elements.SECTION) {
                    this._status.add(Status.error({
                        message: 'ElementFactory cannot handle Sections',
                        source : 'ElementFactory',
                    }));
                } else {
                    this._output.push(element);
                }
            }
        }

        return this.notDone;
    }
}