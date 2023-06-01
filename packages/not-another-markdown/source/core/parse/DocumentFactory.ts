import { Elements } from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { ElementTransformer } from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import DocumentElement from '@photon-rush/not-another-markdown/source/core/parse/elements/DocumentElement';
import SectionElement from '@photon-rush/not-another-markdown/source/core/parse/elements/SectionElement';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';
import Status from '@photon-rush/general/lib/Status';

export default class DocumentFactory {
    private _input  : TokenStream;
    private _output : Array<DocumentElement>;
    private _unknown: Array<TokenInstance>;
    private _status : StatusCollection;

    private _transformers: Array<ElementTransformer>;

    private _currentDocument: DocumentElement;
    private _currentSection : SectionElement;


    constructor(input: TokenStream, transformers: Array<ElementTransformer>) {
        this._input   = input;
        this._output  = [];
        this._unknown = [];
        this._status  = new StatusCollection();

        this._transformers = transformers;

        this._currentDocument = new DocumentElement();
        this._currentSection  = this._currentDocument.content;
    }

    get done() { return this._input.done; }

    get notDone() { return this._input.notDone; }

    get elements(): ReadonlyArray<DocumentElement> { return this._output; } // TODO: Actual Readonly
    get unknown(): ReadonlyArray<TokenInstance> { return this._unknown; } // TODO: Actual Readonly

    get status() { return this._status; }

    private _nextDocument(document: DocumentElement) {
        this._currentDocument = document;
        this._currentSection  = this._currentDocument.content;

        this._output.push(this._currentDocument);
    }

    next() {
        const options = this._transformers.filter(tk => tk.recognize(this._input)); //TODO: create actual readonly proxy

        if (options.length === 0) {
            this._status.add(Status.warn({
                message: `${this._input.position.toString().padStart(4, '0')} No element transformer! ${this._input.peek()}`,
                source : 'DocumentFactory',
            }));

            this._unknown.push(this._input.next());
        } else if (options.length > 1) {
            const transformerList = options.map(t => t.name).join(', ');

            this._status.add(Status.error({
                message: `${this._input.position.toString().padStart(4, '0')} Ambiguous element transformers! ${this._input.peek().type}: ${transformerList}`,
                source : 'DocumentFactory',
            }));
        } else {
            const element = options[0].parse(this._input);

            if (element) {
                if (element.type === Elements.DOCUMENT) {
                    this._nextDocument(element as DocumentElement);
                } else if (element.type === Elements.SECTION) {
                    this._currentSection = this._currentDocument.addSection((element as SectionElement).name);
                } else {
                    this._currentSection.add(element);
                }
            }
        }

        return this.notDone;
    }

    complete() {
        if (this._output.length === 0) {
            this._output.push(this._currentDocument);
        }
    }
}