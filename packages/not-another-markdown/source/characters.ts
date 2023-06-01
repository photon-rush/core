import _isWellFormed from 'string.prototype.iswellformed';
import _toWellFormed from 'string.prototype.towellformed';


// We support all the spaces JavaScript does - Unicode category Zs plus a few obvious extras
const _whitespaceCharacters: ReadonlyArray<string> = [
    '\u0009', // CHARACTER TABULATION
    '\u000B', // LINE TABULATION
    '\u000C', // FORM FEED
    '\u0020', // SPACE
    '\u00A0', // NO-BREAK SPACE
    '\u1680', // OGHAM SPACE MARK
    '\u2000', // EN QUAD
    '\u2001', // EM QUAD
    '\u2002', // EN SPACE
    '\u2003', // EM SPACE
    '\u2004', // THREE-PER-EM SPACE
    '\u2005', // FOUR-PER-EM SPACE
    '\u2006', // SIX-PER-EM SPACE
    '\u2007', // FIGURE SPACE
    '\u2008', // PUNCTUATION SPACE
    '\u2009', // THIN SPACE
    '\u200A', // HAIR SPACE
    '\u202F', // NARROW NO-BREAK SPACE
    '\u205F', // MEDIUM MATHEMATICAL SPACE
    '\u3000', // IDEOGRAPHIC SPACE
    '\uFEFF', // ZERO WIDTH NO-BREAK SPACE
];

// We support all the line breaks JavaScript does
const _lineTerminators: ReadonlyArray<string> = [
    '\u000A', // LINE FEED
    '\u000D', // CARRIAGE RETURN
    '\u2028', // LINE SEPARATOR
    '\u2029', // PARAGRAPH SEPARATOR
];

const _terminatorRegex = `[${_lineTerminators.join('')}]+`;


export const whitespace: ReadonlySet<string> = new Set(_whitespaceCharacters);
export const lineBreaks: ReadonlySet<string> = new Set(_lineTerminators);


/**
 * Checks if a character is whitespace. __Note__: There are a lot more spaces than just the normal one
 * @param char The character to check.
 * @param includeLineBreaks If true, counts line breaks as whitespace too.
 * @returns True if the character is a whitespace character.
 */
export function isWhitespace(char?: string | null, includeTerminators: boolean = false): boolean {
    if (!char) return false;

    return whitespace.has(char) || (includeTerminators && isLineTerminator(char));
}

/**
 * Checks if a character is a line break
 * @param char The character to check.
 * @returns true if the character is a line break.
 */
export function isLineTerminator(char?: string | null): boolean {
    if (!char) return false;

    return lineBreaks.has(char);
}

export function normalizeTerminators(value: string) {
    const regex = new RegExp(_terminatorRegex, 'g');

    return value.trim().replaceAll(regex, '\n');
}


export function isWellFormed(content: string): boolean {
    return _isWellFormed(content);
}

export function toWellFormed(content: string): string {
    return _toWellFormed(content);
}