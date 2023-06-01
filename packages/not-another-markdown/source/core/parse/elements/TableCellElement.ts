import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';

export default class TableCellElement extends ElementInstance {
    constructor() {
        super(Elements.TABLE_CELL);
    }

    simplify(): ISimpleElementData {
        return {};
    }
}