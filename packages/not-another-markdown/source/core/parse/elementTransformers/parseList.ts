import ElementInstance from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import ParagraphElement from '@photon-rush/not-another-markdown/source/core/parse/elements/ParagraphElement';
import ListItemElement from '@photon-rush/not-another-markdown/source/core/parse/elements/ListItemElement';
import UnorderedListElement from '@photon-rush/not-another-markdown/source/core/parse/elements/UnorderedListElement';
import OrderedListElement from '@photon-rush/not-another-markdown/source/core/parse/elements/OrderedListElement';
import DefinitionListItemElement
    from '@photon-rush/not-another-markdown/source/core/parse/elements/DefinitionListItemElement';
import Result from '@photon-rush/results/source/Result';

const listStart = new Set<Token>([
    Token.ORDERED_LIST,
    Token.UNORDERED_LIST,
]);

interface ListItemTemplate {
    type   : Token,
    indent : number,
    element: ListItemElement | DefinitionListItemElement,
}

function readListItem(input: TokenStream): Result<ListItemTemplate> {
    const result = new Result<ListItemTemplate>();

    const type   = input.next().type;
    const indent = input.next().value.length;

    let value = result.extract(ParagraphElement.parse(input));

    if (value) {
        let term: ParagraphElement | null = null;

        if (input.peek().type === Token.LIST_TERM_DIVIDER) {
            term = value;
            input.next(); //:
            value = result.extract(ParagraphElement.parse(input));
        }

        if (value) {
            let element: ListItemElement | DefinitionListItemElement;

            if (term) {
                element = new DefinitionListItemElement(term, value);
            } else {
                element = new ListItemElement();
                value.transfer(element);
            }

            input.next(); // lineBreak

            result.value = {
                type,
                indent,
                element,
            };
        }

    }


    return result;
}

function createListContainer(type: Token): OrderedListElement | UnorderedListElement {
    let result: ElementInstance;
    if (type === Token.UNORDERED_LIST) {
        result = new UnorderedListElement();
    } else {
        result = new OrderedListElement();
    }

    return result;
}


function parseListRecursive(input: TokenStream, listContainer: OrderedListElement | UnorderedListElement, depth: number = 0, messages: Result) {
    while (listStart.has(input.peek().type)) {
        const item = messages.extract(readListItem(input));

        if (item) {
            if (item.indent > depth) {
                const nestedList = createListContainer(item.type);
                listContainer.add(nestedList);

                nestedList.add(item.element);

                const last = parseListRecursive(input, nestedList, item.indent, messages);

                if (last) {
                    listContainer.add(last);
                }
            } else if (item.indent < depth) {
                return item.element;
            } else {
                listContainer.add(item.element);
            }
        }
    }
}

export default function parseList(input: TokenStream): Result<ElementInstance> {
    const result = new Result<ElementInstance>();

    if (!listStart.has(input.peek().type)) throw new Error(`Expected list, got ${input.peek().type}`);

    const listContainer = createListContainer(input.peek().type);

    parseListRecursive(input, listContainer, 0, result);

    result.value = listContainer;

    return result;
}