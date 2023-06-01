import ElementInstance from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import CommandElement from '@photon-rush/not-another-markdown/source/core/parse/elements/CommandElement';
import TextElement from '@photon-rush/not-another-markdown/source/core/parse/elements/TextElement';

const textTerminals = new Set<Token>([
    Token.LINE_BREAK,
    Token.LIST_TERM_DIVIDER,
    Token.TABLE_CELL,
    Token.NONE,
]);

export default function parseText(input: TokenStream, parent: ElementInstance): ElementInstance {
    let emphasis = false;
    let strong   = false;

    while (!textTerminals.has(input.peek().type)) {
        const next = input.next();

        if (next.type === Token.TEXT) {
            parent.add(new TextElement(next.value, emphasis, strong));
        } else if (next.type === Token.EMPHASIS) {
            emphasis = !emphasis;
        } else if (next.type === Token.STRONG) {
            strong = !strong;
        } else if (next.type === Token.COMMAND_NAME) {
            parent.add(CommandElement.parse(input, next.value));
        } else if (next.type === Token.PRE) {
            parent.add(new TextElement(next.value, false, false, true));
        } else if (next.type === Token.NONE) {
            break;
        }
    }

    return parent;
}