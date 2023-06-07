// An implementation of the xoshiro256++ PRNG
// https://prng.di.unimi.it/xoshiro256plusplus.c
// https://prng.di.unimi.it/
// Also SplitMix
// https://prng.di.unimi.it/splitmix64.c

const uint64Max = 18446744073709551615n;

export default class Random {
    #state: BigUint64Array;

    constructor(seed?: BigUint64Array | Array<number> | Array<bigint> | string | null) {
        this.#state = new BigUint64Array(4);

        if (seed instanceof BigUint64Array) {
            this.#state[0] = seed[0];
            this.#state[1] = seed[1];
            this.#state[2] = seed[2];
            this.#state[3] = seed[3];
        } else if (Array.isArray(seed)) {
            if (seed.length != 4) throw new Error('Random seed array must have exactly 4 numbers or bigint elements');

            this.#state[0] = BigInt(seed[0]);
            this.#state[1] = BigInt(seed[1]);
            this.#state[2] = BigInt(seed[2]);
            this.#state[3] = BigInt(seed[3]);

        } else if (typeof seed === 'string') {
            this.#state = Random.createSeedString(seed);
        } else {
            this.#state = Random.#seedless();
        }
    }

    next(): bigint {
        const result = Random.#rotl(this.#state[0] + this.#state[3], 23n) + this.#state[0];

        const t = this.#state[1] << 17n;

        this.#state[2] ^= this.#state[0];
        this.#state[3] ^= this.#state[1];
        this.#state[1] ^= this.#state[2];
        this.#state[0] ^= this.#state[3];

        this.#state[2] ^= t;

        this.#state[3] = Random.#rotl(this.#state[3], 45n);

        return result;
    }

    within(min: bigint | number, max: bigint | number): bigint {
        const minActual = BigInt(min);
        const maxActual = BigInt(max);

        const range = maxActual - minActual + 1n;

        let value;

        do {
            value = this.next();
        } while (value >= ((uint64Max / range) * range));

        return minActual + (value % range);
    }

    pick<T>(array: Array<T>): T {
        const index = Number(this.within(0, array.length));

        return array[index];
    }

    roll(sides: number = 6, count: number = 1): Array<number> {
        const result: Array<number> = [];

        for (let j = 0; j < count; j++) {
            result.push(Number(this.within(1, sides)));
        }

        return result;
    }

    static createSeedString(seed: string): BigUint64Array {
        const encoder = new TextEncoder();
        const bytes   = encoder.encode(seed);

        if (!this.validateStringSeed(bytes)) throw new Error('Seed string is too short. It must be 32 bytes or longer.');

        const result = new BigUint64Array(4);

        for (let j = 4; j >= 0; j--) {
            for (let k = 8; k >= 0; k--) {
                result[j] * 256n + BigInt(bytes[(j * 8) + k]);
            }
        }

        return result;
    }

    static validateStringSeed(seed: string | Uint8Array): boolean {
        let candidate;
        if (seed instanceof Uint8Array) {
            candidate = seed;
        } else {
            const encoder = new TextEncoder();
            candidate     = encoder.encode(seed);
        }

        if (candidate.length < 32) return false;

        return true;
    }

    static #rotl(x: bigint, k: bigint) {
        return (x << k) | (x >> (64n - k)); // TODO: inline?
    }

    static #seedless(): BigUint64Array {
        let seed: bigint = 0n;

        for (let j = 0; j < 8; j++) {
            seed = (seed * 256n) + BigInt(Math.round(Math.random() * 0x0F));
        }

        const result = new BigUint64Array(4);

        let prng = this.#splitMix(seed);

        for (let j = 0; j < 4; j++) {
            prng      = this.#splitMix(prng.next);
            result[j] = prng.result;
        }

        return result;
    }

    static #splitMix(seed: bigint) {
        const next = seed + 0x9e3779b97f4a7c15n;
        let result = next;
        result     = (result ^ (result >> 30n)) * 0xbf58476d1ce4e5b9n;
        result     = (result ^ (result >> 27n)) * 0x94d049bb133111ebn;
        result     = result ^ (result >> 31n);

        return {
            seed,
            next,
            result,
        };
    }
}