import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

export default {
    name: 'Table Cell Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        return input.peek() === '|';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        input.next(); // Cell Divider

        return [
            tokenFactory.createToken(Token.TABLE_CELL),
        ];
    },
};