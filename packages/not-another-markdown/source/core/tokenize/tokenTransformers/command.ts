import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';

import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';

export default {
    name: 'Command Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        return input.peek() === '{';
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        input.next(); // Consume {

        const params: Array<TokenInstance> = [];

        const nameToken = tokenFactory.createToken(Token.COMMAND_NAME);
        const nameTag   = input.consume([':', '}']);
        nameToken.value = nameTag.value.trim();

        if (nameTag.terminal === ':') {
            while (input.notDone) {
                const paramToken = tokenFactory.createToken(Token.COMMAND_PARAMETER);
                const param      = input.consume([',', '}']);
                paramToken.value = param.value.trim();

                params.push(paramToken);

                if (param.terminal === '}') break;
            }
        }

        return [
            nameToken,
            ...params,
        ];
    },
};