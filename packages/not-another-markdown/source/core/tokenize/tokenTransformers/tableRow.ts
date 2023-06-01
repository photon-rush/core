import { isWhitespace } from '@photon-rush/not-another-markdown/source/characters';
import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import { tableTransformers } from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/index';
import Result from '@photon-rush/results/source/Result';

export default {
    name: 'Table Row Token Transformer',

    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        if (!tokenFactory.lastToken.beginning) return false;

        return input.peek() === '|' && isWhitespace(input.peek(1));
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Result<Array<TokenInstance>> {
        const result = new Result<Array<TokenInstance>>;

        const table = result.extract(tokenFactory.nextPhrase(tableTransformers));

        result.value = [
            tokenFactory.createToken(Token.TABLE_ROW),
            ...(table || []),
            tokenFactory.createToken(Token.LINE_BREAK),
        ];

        return result;
    },
};