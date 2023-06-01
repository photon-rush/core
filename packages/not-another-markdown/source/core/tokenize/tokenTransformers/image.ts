import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import link from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/link';
import Result from '@photon-rush/results/source/Result';


export default {
    name: 'Image Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        return input.peek() === '!' && input.peek(1) === '[';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Result<Array<TokenInstance>> {
        const result = new Result<Array<TokenInstance>>;

        input.next(); // Consume !

        const tokens = result.extract(link.parse(input, tokenFactory));

        if (!tokens) return result;

        tokens[0].value = 'image';

        result.value = tokens;

        return result;
    },
};