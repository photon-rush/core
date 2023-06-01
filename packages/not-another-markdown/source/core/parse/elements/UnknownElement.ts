import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';

export default class UnknownElement extends ElementInstance {
    constructor() {
        super(Elements.UNKNOWN);
    }

    simplify(): ISimpleElementData {
        return {};
    }
}