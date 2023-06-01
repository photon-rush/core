import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, {Token} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import Result from '@photon-rush/results/source/Result';

export default {
    name: 'Table Divider Token Transformer',
    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        if (!tokenFactory.lastToken.beginning) return false;

        return input.peek() === '|' && input.peek(1) === '-';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Result<Array<TokenInstance>> {
        const result = new Result<Array<TokenInstance>>;

        input.consumeLine();

        result.value = [tokenFactory.createToken(Token.TABLE_DIVIDER), tokenFactory.createToken(Token.LINE_BREAK)];

        return result;
    },
};