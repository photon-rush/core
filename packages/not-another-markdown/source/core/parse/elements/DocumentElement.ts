import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import {ElementTransformer} from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import SectionElement from '@photon-rush/not-another-markdown/source/core/parse/elements/SectionElement';
import Result from '@photon-rush/results/source/Result';

export enum Section {
    CONTENT = '!content',
    META = '!meta',
    REFERENCE = '!reference',
    NOTE = '!note',
}

const definedSections: Set<string> = new Set(Object.values(Section));

export default class DocumentElement extends ElementInstance {
    private _predefinedSectionMap: Readonly<Record<Section, SectionElement>>;
    private _otherSections: Record<string, SectionElement>;

    constructor() {
        super(Elements.DOCUMENT);

        this._predefinedSectionMap = {
            [Section.CONTENT]: new SectionElement(Section.CONTENT),
            [Section.META]: new SectionElement(Section.META),
            [Section.REFERENCE]: new SectionElement(Section.REFERENCE),
            [Section.NOTE]: new SectionElement(Section.NOTE),
        };

        this.add(this._predefinedSectionMap[Section.CONTENT]);
        this.add(this._predefinedSectionMap[Section.REFERENCE]);
        this.add(this._predefinedSectionMap[Section.META]);
        this.add(this._predefinedSectionMap[Section.NOTE]);

        this._otherSections = {};
    }

    get content() { return this._predefinedSectionMap[Section.CONTENT]; }

    get reference() { return this._predefinedSectionMap[Section.REFERENCE]; }

    get meta() { return this._predefinedSectionMap[Section.META]; }

    get note() { return this._predefinedSectionMap[Section.NOTE]; }

    getSection(section: string): SectionElement | null {
        if (DocumentElement.isPredefined(section)) {
            return this._predefinedSectionMap[section as Section];
        } else {
            return this._otherSections[section] || null;
        }
    }

    addSection(name: string): SectionElement {
        if (DocumentElement.isPredefined(name)) {
            return this._predefinedSectionMap[name as Section];
        }

        if (this._otherSections[name]) {
            return this._otherSections[name];
        }

        const newSection = new SectionElement(name);
        this._otherSections[name] = newSection;
        this.add(newSection);

        return newSection;
    }

    simplify(): ISimpleElementData {
        return {};
    }

    static isPredefined(sectionName: string): boolean {
        return definedSections.has(sectionName);
    }

    static recognize(input: TokenStream): boolean {
        return input.peek().type === Token.START;
    }

    static parse(input: TokenStream): Result<DocumentElement> {
        const result = new Result<DocumentElement>(new DocumentElement());

        input.next();

        return result;


    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name: 'DocumentElement',
            recognize: DocumentElement.recognize,
            parse: DocumentElement.parse,
        });
    }
}