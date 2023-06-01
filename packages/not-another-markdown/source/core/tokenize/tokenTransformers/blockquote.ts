import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';

import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';

export default {
    name: 'Blockquote Token Transformer',

    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        if (!tokenFactory.lastToken.beginning) return false;

        return input.match('> ');
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        input.next();
        input.next();

        return [
            tokenFactory.createToken(Token.BLOCK_QUOTE, input.consumeLine()),
            tokenFactory.createToken(Token.LINE_BREAK),
        ];
    },
};