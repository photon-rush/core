import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import link from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/link';

export default {
    name: 'Image Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        return input.peek() === '!' && input.peek(1) === '[';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        input.next(); // Consume !

        const tokens = link.parse(input, tokenFactory);

        if (!tokens) return [];

        tokens[0].value = 'image';

        return tokens;
    },
};