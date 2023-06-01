export default class BaseStream<T> {
    #_buffer: Array<T>;
    #_length: number;
    #_position: number;
    #_last: T;
    #_factory: string | (new () => T);

    #createDefault(): T {
        if (typeof this.#_factory === 'string') {
            return this.#_factory as T;
        } else {
            return new this.#_factory();
        }
    }

    constructor(iterable: Iterable<T> | ArrayLike<T>, factory: string | (new () => T)) {
        this.#_buffer = Array.from(iterable);
        this.#_length = this.#_buffer.length;
        this.#_position = 0;

        this.#_factory = factory;
        this.#_last = this.#createDefault();
    }

    get length() { return this.#_length; }
    get position() { return this.#_position; }
    get last() { return this.#_last; }
    get done() { return this.#_buffer.length === 0; }
    get notDone() { return this.#_buffer.length > 0; }

    get location() {
        return {
            length: this.#_length,
            position: this.#_position,
        };
    }

    peek(at: number = 0) {
        return this.#_buffer[at] || this.#createDefault();
    }

    next(): T {
        const value = this.#_buffer.shift();
        this.#_position++;

        if (value) {
            this.#_last = value;
            this.#_position++;

            return value;
        } else {
            return this.#createDefault();
        }
    }
}