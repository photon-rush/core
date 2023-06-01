import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

export default {
    name: 'Pre Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        if (input.peek() === '`' && input.peek(1) !== '`') return true;

        return false;
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        const token = tokenFactory.createToken(Token.PRE);
        token.value = input.next();

        const next = input.consume(['`', '\n'], false);

        if (next.terminal === '\n') {
            return [
                tokenFactory.createToken(Token.TEXT, '`' + next.value),
            ];
        } else {
            return [
                tokenFactory.createToken(Token.PRE, next.value),
            ];
        }
    },
};