import ElementInstance, {
    Elements,
    ISimpleElementData,
} from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { ElementTransformer } from '@photon-rush/not-another-markdown/source/core/parse/ElementTransformer';
import { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import parseText from '@photon-rush/not-another-markdown/source/core/parse/elementTransformers/parseText';
import TableCellElement from '@photon-rush/not-another-markdown/source/core/parse/elements/TableCellElement';
import TableRowElement from '@photon-rush/not-another-markdown/source/core/parse/elements/TableRowElement';

export default class TableElement extends ElementInstance {
    constructor() {
        super(Elements.TABLE);
    }

    simplify(): ISimpleElementData {
        return {};
    }

    static recognize(input: TokenStream): boolean {
        return input.peek().type === Token.TABLE_ROW;
    }

    static parse(input: TokenStream): TableElement {
        const table = new TableElement();

        while (input.peek().type === Token.TABLE_ROW) {
            input.next(); //tableRow
            const row = new TableRowElement();
            table.add(row);

            while (input.peek().type === Token.TABLE_CELL) {
                input.next(); //tableCell
                const cell = new TableCellElement();
                row.add(cell);

                parseText(input, cell);
            }

            input.consumeLineBreaks();

            if (input.peek().type === Token.TABLE_DIVIDER) {
                row.isHeader = true;
                input.next(); //tableDivider
            }
        }

        return table;
    }

    static get transformer() {
        return ElementTransformer.fromObject({
            name     : 'TableElement',
            recognize: this.recognize,
            parse    : this.parse,
        });
    }
}