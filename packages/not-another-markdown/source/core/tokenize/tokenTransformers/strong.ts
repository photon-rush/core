import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import Result from '@photon-rush/results/source/Result';

export default {
    name: 'Strong Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        if (input.peek() === '*' && input.peek(1) === '*' && input.peek(2) !== '*') return true;
        if (input.peek() === '_' && input.peek(1) === '_' && input.peek(2) !== '_') return true;

        return false;
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Result<Array<TokenInstance>> {
        const result = new Result<Array<TokenInstance>>;

        const token = tokenFactory.createToken(Token.STRONG);
        token.value = input.next() + input.next();

        result.value = [token];

        return result;
    },
};