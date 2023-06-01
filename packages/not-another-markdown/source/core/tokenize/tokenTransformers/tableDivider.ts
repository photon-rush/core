import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

export default {
    name: 'Table Divider Token Transformer',
    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        if (!tokenFactory.lastToken.beginning) return false;

        return input.peek() === '|' && input.peek(1) === '-';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        input.consumeLine();

        return [
            tokenFactory.createToken(Token.TABLE_DIVIDER),
            tokenFactory.createToken(Token.LINE_BREAK),
        ];
    },
};