import { isLineTerminator, isWhitespace } from '@photon-rush/not-another-markdown/source/characters';
import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import { orderedListTransformers } from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/index';

const SEPARATOR = '.';

const terminalList = (() => {
    const tokens = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let k = 0x41; k <= 0x5A; k++) {
        tokens.push(String.fromCharCode(k));
    }

    for (let k = 0x61; k <= 0x7A; k++) {
        tokens.push(String.fromCharCode(k));
    }

    return tokens;

})();

const terminals: ReadonlySet<string> = new Set(terminalList);

export default {
    name: 'Ordered List Token Transformer',

    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        if (!tokenFactory.lastToken.beginning) return false;

        let offset = 0;

        while (offset < input.length) {
            if (!input.peek(offset)) return false;
            if (isLineTerminator(input.peek(offset))) return false;
            if (input.peek(offset) === SEPARATOR) break;

            if (terminals.has(input.peek(offset)) || isWhitespace(input.peek(offset))) {
                offset++;
            } else {
                return false;
            }
        }

        return isWhitespace(input.peek(offset + 1));
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        const indent = input.consumeUntil(terminalList);
        input.consume(SEPARATOR); //ordinal
        const nextPhrase = tokenFactory.nextPhrase(orderedListTransformers);

        const value = input.consumeLine();

        return [
            tokenFactory.createToken(Token.ORDERED_LIST, value),
            tokenFactory.createToken(Token.LIST_INDENT, indent),
            ...(nextPhrase || []),
            tokenFactory.createToken(Token.LINE_BREAK),
        ];
    },
};