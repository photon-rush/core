import ElementInstance, {Elements} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import {ElementTransformer} from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import DocumentElement from '@photon-rush/not-another-markdown/source/core/parse/elements/DocumentElement';
import SectionElement from '@photon-rush/not-another-markdown/source/core/parse/elements/SectionElement';
import Result from '@photon-rush/results/source/Result';
import VResult from '@photon-rush/results/source/VResult';

export default class DocumentFactory {
    private _input: TokenStream;
    private _output: VResult<Array<DocumentElement>>;
    private _unknown: Array<TokenInstance>;

    private _transformers: Array<ElementTransformer>;

    private _currentDocument: DocumentElement;
    private _currentSection: SectionElement;

    constructor(input: TokenStream, transformers: Array<ElementTransformer>) {
        this._input = input;
        this._output = new VResult<Array<DocumentElement>>([]);
        this._unknown = [];

        this._transformers = transformers;

        this._currentDocument = new DocumentElement();
        this._currentSection = this._currentDocument.content;
    }

    get done() { return this._input.done; }

    get notDone() { return this._input.notDone; }

    get elements(): ReadonlyArray<DocumentElement> { return this._output.value; } // TODO: Actual Readonly
    get unknown(): ReadonlyArray<TokenInstance> { return this._unknown; } // TODO: Actual Readonly

    private _nextDocument(document: DocumentElement) {
        this._currentDocument = document;
        this._currentSection = this._currentDocument.content;

        this._output.value.push(this._currentDocument);
    }

    next() {
        const result = new Result<ElementInstance>();

        const options = this._transformers.filter(tk => tk.recognize(this._input)); //TODO: create actual readonly proxy

        if (options.length === 0) {
            result.add({
                level: 'warning',
                text: `${this._input.position.toString().padStart(4, '0')} No element transformer! ${this._input.peek()}`,
                source: 'DocumentFactory',
            });

            this._unknown.push(this._input.next());
        } else if (options.length > 1) {
            const transformerList = options.map(t => t.name).join(', ');

            result.add({
                level: 'error',
                text: `${this._input.position.toString().padStart(4, '0')} Ambiguous element transformers! ${this._input.peek().type}: ${transformerList}`,
                source: 'DocumentFactory',
            });
        } else {
            const element = result.extract(options[0].parse(this._input));
            this._output.extract(result);

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
        if (this._output.value.length === 0) {
            this._output.value.push(this._currentDocument);
        }
    }
}