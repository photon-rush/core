import { isWhitespace } from '@photon-rush/not-another-markdown/source/characters';
import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';

export default {
    name: 'Definition List Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        return input.peek() === ':' && isWhitespace(input.peek(1));
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        const token = tokenFactory.createToken(Token.LIST_TERM_DIVIDER);
        token.value = input.next();
        input.next();

        return [token];
    },
};