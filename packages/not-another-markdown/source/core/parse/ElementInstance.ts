const idFactory = new (class IdFactory {
    #id = 0;

    next() { return this.#id++; }
})();

export enum Elements {
    UNKNOWN = 'unknown',
    DOCUMENT = 'document',
    SECTION = 'section',
    HEADING = 'heading',
    CODE = 'code',
    PARAGRAPH = 'paragraph',
    TEXT = 'text',
    COMMAND = 'command',
    BLOCK_QUOTE = 'blockQuote',
    CALLOUT = 'callout',
    UNORDERED_LIST = 'unorderedList',
    ORDERED_LIST = 'orderedList',
    LIST_ITEM = 'listItem',
    DEFINITION_LIST_ITEM = 'definitionListItem',
    TABLE = 'table',
    TABLE_ROW = 'tableRow',
    TABLE_CELL = 'tableCell',
}


export type ISimpleElementData = Record<string, string | number | boolean | Array<string>>;

export interface ISimpleElement {
    type: Elements;
    children?: Array<ISimpleElement>;
    data?: ISimpleElementData;
}

export default abstract class ElementInstance {
    private _children: Array<ElementInstance>;
    private _type: Elements;
    private _parent: ElementInstance | null;
    private _id: string;


    constructor(type: Elements) {
        this._type = type;
        this._children = [];
        this._parent = null;
        this._id = `${type}_${idFactory.next()}`;


    }

    get type() { return this._type; }

    get id() {return this._id;}

    get key() {return this._id;}

    get parent() { return this._parent; }

    get children(): ReadonlyArray<ElementInstance> { return this._children; }

    add(element?: ElementInstance | Array<ElementInstance>) {
        if (!element) return;

        if (Array.isArray(element)) {
            element.forEach(e => this.add(e));
        } else {
            element._parent = this;
            this._children.push(element);
        }
    }

    transfer(destination: ElementInstance) {
        this.children.forEach(child => {
            destination.add(child);
        });

        this._children = [];
    }

    clear() {
        this.children.forEach(child => {
            child._parent = null;
        });

        this._children = [];
    }

    abstract simplify(): ISimpleElementData;

    toSimpleElement(): ISimpleElement {
        const result: ISimpleElement = {
            type: this.type,
        };

        const data = this.simplify();

        if (Object.keys(data).length > 0) {
            result.data = data;
        }

        if (this._children.length > 0) {
            const children: Array<ISimpleElement> = [];

            this.children.forEach(c => {
                children.push(c.toSimpleElement());
            });

            result.children = children;
        }

        return result;
    }

    serialize(): string {
        const result = this.toSimpleElement();

        return JSON.stringify(result, null, '\t');
    }

    toString() {
        const type = this.type.padStart(20);
        const value = JSON.stringify(this.simplify()).replaceAll('\n', ' ');

        return `${type} |> ${value}`;
    }
}