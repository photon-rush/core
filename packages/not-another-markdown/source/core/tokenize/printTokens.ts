import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';


export function printTokens(tokens?: ReadonlyArray<TokenInstance> | null) {
    if (!tokens) return '<No Tokens>';

    let result = '';

    tokens.forEach(instance => {
        result = `${result}\n${instance.toString(false)}`;
    });

    return result;
}