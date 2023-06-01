import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

export default {
    name: 'Horizontal Rule Token Transformer',

    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        if (!tokenFactory.lastToken.beginning) return false;

        if (input.matchLine('-')) return true;
        if (input.matchLine('=')) return true;
        if (input.matchLine('*')) return true;

        return false;
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        const token = tokenFactory.createToken(Token.HORIZONTAL_RULE);

        token.value = input.consumeLine();

        return [
            token,
            tokenFactory.createToken(Token.LINE_BREAK),
        ];
    },
};