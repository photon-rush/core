import BaseStream from '@photon-rush/not-another-markdown/source/core/BaseStream';
import TokenInstance, { Token } from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';

export default class TokenStream extends BaseStream<TokenInstance> {

    constructor(iterable: Iterable<TokenInstance> | ArrayLike<TokenInstance>) {
        super(iterable, TokenInstance);
    }

    match(value: ReadonlyArray<Token>): boolean {
        for (let k = 0; k < value.length; k++) {
            if (this.peek(k).type !== value[k]) return false;
        }

        return true;
    }

    matchOne(value: ReadonlyArray<Token>): boolean {
        const type = this.peek().type;

        for (let k = 0; k < value.length; k++) {
            if (value[k] === type) return true;
        }

        return false;
    }

    consume(terminals: Array<Token>) {
        const value    = this.consumeUntil(terminals);
        const terminal = this.next();

        return {
            value,
            terminal,
        };
    }

    consumeUntil(terminals: ReadonlyArray<Token>): Array<TokenInstance> {
        const breakSet = new Set<string>(terminals);

        const result: Array<TokenInstance> = [];

        while (this.notDone) {
            if (breakSet.has(this.peek().type)) break;

            result.push(this.next());
        }

        return result;
    }

    consumeLineBreaks(): number {
        let counter = 0;

        while (this.peek().type === Token.LINE_BREAK) {
            this.next();
            counter++;
        }

        return counter;
    }
}