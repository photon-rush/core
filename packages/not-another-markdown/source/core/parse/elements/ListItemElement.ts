import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';

export default class ListItemElement extends ElementInstance {
    constructor() {
        super(Elements.LIST_ITEM);
    }

    simplify(): ISimpleElementData {
        return {};
    }
}