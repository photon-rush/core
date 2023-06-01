/* eslint-disable no-constant-condition */

import { isLineTerminator, isWhitespace } from '@photon-rush/not-another-markdown/source/characters';
import BaseStream from '@photon-rush/not-another-markdown/source/core/BaseStream';
import SourceLocation from '@photon-rush/not-another-markdown/source/core/SourceLocation';
import ISourceLocation from '@photon-rush/not-another-markdown/source/core/SourceLocation';

export interface IReadonlyCharacterStream {
    peek(at?: number): string,

    match(value: string | ReadonlyArray<string>): boolean,

    matchLine(char: string): boolean,

    get length(): number,

    get last(): string,
}

/**
 * Produces characters from SourceText
 */
export default class CharacterStream extends BaseStream<string> implements IReadonlyCharacterStream {
    private _fileLocation : string;
    private _currentLine  : number;
    private _currentColumn: number;

    constructor(sourceText: string, fileLocation?: string | null) {
        super(sourceText, '');

        this._fileLocation  = fileLocation || '';
        this._currentLine   = 0;
        this._currentColumn = 0;
    }

    get fileLocation() { return this._fileLocation; }

    override next(): string {
        const value = super.next();

        if (value === '\n') {
            this._currentLine++;
            this._currentColumn = 0;
        } else if (value) {
            this._currentColumn++;
        }

        return value;
    }

    getSourceLocation(): ISourceLocation {
        return new SourceLocation({
            length      : this.length,
            position    : this.position,
            line        : this._currentLine,
            column      : this._currentColumn,
            fileLocation: this.fileLocation,
            valid       : true,
        });
    }

    match(value: string | ReadonlyArray<string>): boolean {
        const compare: ReadonlyArray<string> = typeof value === 'string' ? Array.from(value) : value;

        for (let k = 0; k < compare.length; k++) {
            if (this.peek(k) !== compare[k]) return false;
        }

        return true;
    }

    matchLine(char: string): boolean {
        if (this.peek() !== char) return false;

        let offset = 0;

        while (true) {
            if (!this.peek(offset)) return true;
            if (isLineTerminator(this.peek(offset))) return true;

            if (this.peek(offset) !== char) return false;

            offset++;
        }
    }

    /**
     * Consumes characters up to, and including a terminal provided (or the end of the content).
     * @param terminals A list of characters to stop at
     * @param escape If true, allow escape sequences (always denoted by a \ character)
     * @returns An object containing the value and the terminal that stopped the consumer. If the consumer reached the end of the content, the terminal will be the empty string.
     */
    consume(terminals: Array<string> | string, escape: boolean = true) {
        const value    = this.consumeUntil(terminals, escape);
        const terminal = this.next();

        return {
            value,
            terminal,
        };
    }

    /**
     * Consumes characters up to, but not including a terminal provided (or the end of the content).
     * @param terminals A list of characters to stop at
     * @param escape If true, allow escape sequences (always denoted by a \ character)
     * @returns The value consumed. The terminal is left in the stream
     */
    consumeUntil(terminals: Array<string> | string, escape: boolean = true): string {
        const breakSet = typeof terminals === 'string'
            ? new Set<string>([terminals])
            : new Set<string>(terminals);

        let acc        = '';
        let makeEscape = false;

        while (this.notDone) {
            if (makeEscape) {
                acc       += this.next();
                makeEscape = false;
            } else if (this.peek() === '\\' && escape) {
                this.next();
                makeEscape = true;
            } else if (breakSet.has(this.peek())) {
                break;
            } else {
                acc += this.next();
            }
        }

        return acc;
    }

    /**
     * Consumes characters until the end of the line. The line break is not left in the stream.
     * @returns The line
     */
    consumeLine(): string {
        let acc = '';

        while (this.notDone) {
            if (isLineTerminator(this.peek())) {
                this.next();
                break;
            } else {
                acc += this.next();
            }
        }

        return acc;
    }

    /**
     * Consumes a contiguous block of whitespace. If the next character is not whitespace, this does nothing.
     * @param includeLineBreaks If true, will also consume linebreaks
     * @returns The number of whitespace characters consumed
     */
    consumeWhitespace(includeLineBreaks: boolean = false): number {
        let counter = 0;

        while (this.notDone) {
            if (isWhitespace(this.peek(), includeLineBreaks)) {
                this.next();
                counter++;
            } else {
                break;
            }
        }

        return counter;
    }
}