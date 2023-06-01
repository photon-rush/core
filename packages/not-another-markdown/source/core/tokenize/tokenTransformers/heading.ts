import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import Result from '@photon-rush/results/source/Result';

export default {
    name: 'Heading Token Transformer',

    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        return tokenFactory.lastToken.beginning && input.peek() === '#';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Result<Array<TokenInstance>> {
        const result = new Result<Array<TokenInstance>>;

        let level = 1;
        input.next();

        while (input.notDone) {
            if (input.peek() === '#') {
                input.next();
                level++;
            } else {
                input.next();
                break;
            }
        }

        let type: Token = Token.UNKNOWN;

        switch (level) {
        case 1:
            type = Token.HEADING1;
            break;
        case 2:
            type = Token.HEADING2;
            break;
        case 3:
            type = Token.HEADING3;
            break;
        case 4:
            type = Token.HEADING4;
            break;
        case 5:
            type = Token.HEADING5;
            break;
        case 6:
            type = Token.HEADING6;
            break;
        }

        result.value = [
            tokenFactory.createToken(type, input.consumeLine()),
            tokenFactory.createToken(Token.LINE_BREAK),
        ];

        return result;
    },
};