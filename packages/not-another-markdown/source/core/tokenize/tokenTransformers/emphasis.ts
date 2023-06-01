import { isWhitespace } from '@photon-rush/not-another-markdown/source/characters';
import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';

export default {
    name: 'Emphasis Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        if (input.peek() === '*' && !(input.peek(1) === '*' || isWhitespace(input.peek(1)))) return true;
        if (input.peek() === '_' && input.peek(1) !== '_') return true;

        return false;
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        const token = tokenFactory.createToken(Token.EMPHASIS);
        token.value = input.next();

        return [token];
    },
};