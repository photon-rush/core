import { isLineTerminator, isWhitespace } from '@photon-rush/not-another-markdown/source/characters';
import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

import {
    unorderedListTransformers,
} from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/index';

const terminals: ReadonlySet<string> = new Set(['*', '-', '+']);

export default {
    name: 'Ordered List Token Transformer',

    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        if (!tokenFactory.lastToken.beginning) return false;

        let offset = 0;

        while (offset < input.length) {
            if (!input.peek(offset)) return false;
            if (isLineTerminator(input.peek(offset))) return false;

            if (isWhitespace(input.peek(offset))) {
                offset++;
            } else if (terminals.has(input.peek(offset))) {
                break;
            } else {
                return false;
            }
        }

        return isWhitespace(input.peek(offset + 1));
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        const indent = input.consumeUntil(['*', '-', '+']);
        input.next(); //bullet
        input.next(); //space

        const nextPhrase = tokenFactory.nextPhrase(unorderedListTransformers);

        return [
            tokenFactory.createToken(Token.UNORDERED_LIST),
            tokenFactory.createToken(Token.LIST_INDENT, indent),
            ...(nextPhrase || []),
        ];
    },
};