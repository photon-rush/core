import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import Result from '@photon-rush/results/source/Result';

export default {
    name: 'Table Cell Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        return input.peek() === '|';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Result<Array<TokenInstance>> {
        const result = new Result<Array<TokenInstance>>;

        input.next(); // Cell Divider

        result.value = [tokenFactory.createToken(Token.TABLE_CELL)];

        return result;
    },
};