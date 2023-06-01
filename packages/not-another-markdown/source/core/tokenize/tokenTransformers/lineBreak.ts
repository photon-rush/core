import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

export default {
    name: 'Line Break Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        return input.peek() === '\n';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        input.next();

        return [
            tokenFactory.createToken(Token.LINE_BREAK),
        ];
    },
};