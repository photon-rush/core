import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';

import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';

export default {
    name: 'Code Token Transformer',

    recognize(input: IReadonlyCharacterStream, tokenFactory: TokenFactory): boolean {
        if (!tokenFactory.lastToken.beginning) return false;

        return input.match('```');
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        input.next(); // Consume `
        input.next(); // Consume `
        input.next(); // Consume `

        const lines: Array<TokenInstance> = [];

        const token = tokenFactory.createToken(Token.CODE_START);
        token.value = input.consumeLine().trim();

        while (input.notDone) {
            if (input.match('```')) {
                input.consumeLine();
                break;
            }

            const line = tokenFactory.createToken(Token.CODE_LINE);
            line.value = input.consumeLine().trim();

            lines.push(line);
        }

        return [
            token,
            ...lines,
            tokenFactory.createToken(Token.LINE_BREAK),
        ];
    },
};