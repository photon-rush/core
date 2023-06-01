import CharacterStream from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

import IParseOptions from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import {printTokens} from '@photon-rush/not-another-markdown/source/core/tokenize/printTokens';
import tokenTransformers from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers';
import Result from '@photon-rush/results/source/Result';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';

export default function tokenize(sourceText: string, options: IParseOptions): Result<Array<TokenInstance>> {
    const result = new Result<Array<TokenInstance>>();

    const characterStream = new CharacterStream(sourceText);
    const tokenFactory    = new TokenFactory(characterStream, tokenTransformers);

    while (tokenFactory.notDone) {
        tokenFactory.next();
    }

    tokenFactory.complete();

    // console.log(printTokens(tokenFactory.tokens));

    result.value = [...tokenFactory.tokens];

    if (options.debug) {
        console.groupCollapsed(`Tokens: ${options.fileLocation}`);
        console.log(printTokens(result.value));
        console.groupEnd();
    }


    return result;
}