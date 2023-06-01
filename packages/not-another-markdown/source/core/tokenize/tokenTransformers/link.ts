import CharacterStream, {
    IReadonlyCharacterStream,
} from '@photon-rush/not-another-markdown/source/core/tokenize/CharacterStream';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import TokenFactory from '@photon-rush/not-another-markdown/source/core/tokenize/TokenFactory';

const BRACKET_OPEN  = '[';
const BRACKET_CLOSE = ']';

const PAREN_OPEN  = '(';
const PAREN_CLOSE = ')';

const ANGLE_OPEN  = '<';
const ANGLE_CLOSE = '>';

const QUOTE = '"';

function simpleLink(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
    const url       = input.consume(ANGLE_CLOSE).value;
    const text      = url;
    const title     = '';
    const reference = '';

    return tokenFactory.createCommand('link', [
        text,
        title,
        url,
        reference,
    ]);
}

function normalLink(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
    let text      = '';
    let title     = '';
    let url       = '';
    let reference = '';

    text = input.consume(BRACKET_CLOSE).value;

    if (input.peek() === PAREN_OPEN) {
        input.next();
        const next = input.consume([PAREN_CLOSE, QUOTE]);
        url        = next.value;

        if (next.terminal === QUOTE) {
            title = input.consume(QUOTE).value;
            input.consume(PAREN_CLOSE);
        }
    } else if (input.peek() === BRACKET_OPEN) {
        input.next();
        reference = input.consume(BRACKET_CLOSE).value;
    } else {
        console.log('What?');
        console.log(`'${input.peek()}'`);
    }

    return tokenFactory.createCommand('link', [
        text,
        title,
        url,
        reference,
    ]);
}

export default {
    name: 'Link Token Transformer',

    recognize(input: IReadonlyCharacterStream): boolean {
        if (input.last === '\\') return false;

        return input.peek() === BRACKET_OPEN || input.peek() === ANGLE_OPEN;
    },

    parse(input: CharacterStream, tokenFactory: TokenFactory): Array<TokenInstance> {
        const linkType = input.next(); // consume [

        if (linkType === ANGLE_OPEN) {
            return simpleLink(input, tokenFactory);
        } else {
            return normalLink(input, tokenFactory);
        }
    },
};