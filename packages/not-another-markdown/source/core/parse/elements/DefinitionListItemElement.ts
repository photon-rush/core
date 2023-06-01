import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import ParagraphElement from '@photon-rush/not-another-markdown/source/core/parse/elements/ParagraphElement';

export default class DefinitionListItemElement extends ElementInstance {
    constructor(term?: ParagraphElement, definition?: ParagraphElement) {
        super(Elements.DEFINITION_LIST_ITEM);

        this._add(term || new ParagraphElement());
        this._add(definition || new ParagraphElement());
    }

    simplify(): ISimpleElementData {
        return {};
    }

    public override add() { throw new Error('Cannot add elements to a Definition List Item'); }

    private _add(element?: ElementInstance | Array<ElementInstance>) {
        super.add(element);
    }


    get term(): ParagraphElement {
        return this.children[0];
    }

    set term(value: ParagraphElement) {
        const definition = this.definition;

        this.clear();

        this._add(value);
        this._add(definition);
    }

    get definition(): ParagraphElement {
        return this.children[1];
    }

    set definition(value: ParagraphElement) {
        const term = this.term;

        this.clear();

        this._add(term);
        this._add(value);
    }


}