import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';

export default class TableRowElement extends ElementInstance {
    public isHeader: boolean;

    constructor(isHeader: boolean = false) {
        super(Elements.TABLE_ROW);

        this.isHeader = isHeader;
    }

    simplify(): ISimpleElementData {
        return {
            isHeader: this.isHeader,
        };
    }
}