import CharacterStream from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

import IParseOptions from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import { printTokens } from '@photon-rush/not-another-markdown/source/core/tokenize/printTokens';
import tokenTransformers from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';

export default function tokenize(sourceText: string, options: IParseOptions): Array<TokenInstance> {
    const characterStream = new CharacterStream(sourceText);
    const tokenFactory    = new TokenFactory(characterStream, tokenTransformers);

    while (tokenFactory.notDone) {
        tokenFactory.next();
    }

    tokenFactory.complete();

    const result = Array.from(tokenFactory.tokens);

    if (options.debug) {
        console.groupCollapsed(`Tokens: ${options.fileLocation}`);
        console.log(printTokens(result));
        console.groupEnd();
    }

    return result;
}