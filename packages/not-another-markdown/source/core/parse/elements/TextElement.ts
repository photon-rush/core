import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';

export default class TextElement extends ElementInstance {
    public text: string;
    public hasEmphasis: boolean;
    public hasStrength: boolean;
    public isPreformatted: boolean;

    constructor(text: string = '', hasEmphasis: boolean = false, hasStrength: boolean = false, isPreformatted: boolean = false) {
        super(Elements.TEXT);

        this.text = text;
        this.hasEmphasis = hasEmphasis;
        this.hasStrength = hasStrength;
        this.isPreformatted = isPreformatted;
    }

    simplify(): ISimpleElementData {
        return {
            text: this.text,
            hasEmphasis: this.hasEmphasis,
            hasStrength: this.hasStrength,
            pre: this.isPreformatted,
        };
    }
}