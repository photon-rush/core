import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import Result from '@photon-rush/results/source/Result';

export default {
    name: 'Pre Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        if (input.peek() === '`' && input.peek(1) !== '`') return true;

        return false;
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Result<Array<TokenInstance>> {
        const result = new Result<Array<TokenInstance>>;

        const token = tokenFactory.createToken(Token.PRE);
        token.value = input.next();

        const next = input.consume(['`', '\n'], false);

        if (next.terminal === '\n') {
            result.value = [tokenFactory.createToken(Token.TEXT, '`' + next.value)];
        } else {
            result.value = [tokenFactory.createToken(Token.PRE, next.value)];
        }

        return result;
    },
};