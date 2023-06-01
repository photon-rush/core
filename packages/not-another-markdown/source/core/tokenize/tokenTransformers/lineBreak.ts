import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import Result from '@photon-rush/results/source/Result';

export default {
    name: 'Line Break Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        return input.peek() === '\n';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Result<Array<TokenInstance>> {
        const result = new Result<Array<TokenInstance>>;

        input.next();

        result.value = [tokenFactory.createToken(Token.LINE_BREAK)];

        return result;
    },
};