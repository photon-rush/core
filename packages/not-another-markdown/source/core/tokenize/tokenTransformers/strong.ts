import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
export default {
    name: 'Strong Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        if (input.peek() === '*' && input.peek(1) === '*' && input.peek(2) !== '*') return true;
        if (input.peek() === '_' && input.peek(1) === '_' && input.peek(2) !== '_') return true;

        return false;
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        const token = tokenFactory.createToken(Token.STRONG);
        token.value = input.next() + input.next();

        return [token];
    },
};