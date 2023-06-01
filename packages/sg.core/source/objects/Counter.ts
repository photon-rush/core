import { IPhotonObject, ISimplePhotonObject } from '@photon-rush/sg.core/source/photon/IPhotonObject';

export interface ICounter {
    value    : number,
    increment: number,
    frequency: number,
    cap      : number,
    active   : boolean,
    bypass   : boolean,
}


export default class Counter implements IPhotonObject<ICounter>, ICounter {
    #accumulator: number;
    #frequency  : number;

    value    : number;
    increment: number;
    cap      : number;
    active   : boolean;
    bypass   : boolean;

    constructor(counter?: ICounter) {
        if (counter) {
            this.increment  = counter.increment;
            this.value      = counter.value;
            this.#frequency = counter.frequency;
            this.cap        = counter.cap;
            this.bypass     = counter.bypass;
            this.active     = counter.active;
        } else {
            this.increment  = 1;
            this.value      = 0;
            this.#frequency = 1000;
            this.cap        = Infinity;
            this.bypass     = false;
            this.active     = true;
        }


        this.#accumulator = 0;
    }

    get frequency(): number {
        return this.#frequency;
    }

    set frequency(value: number) {
        if (this.increment !== value) this.#accumulator = 0;

        this.#frequency = value;
    }

    copy(): Counter {
        return new Counter(this);
    }

    equals(o?: ICounter | null): boolean {
        return false;
    }

    save(): ISimplePhotonObject & ICounter {
        return {
            type: Counter.type,
            ...this.simplify(),
        };
    }

    simplify(): ICounter {
        return {
            value    : this.value,
            increment: this.increment,
            frequency: this.frequency,
            cap      : this.cap,
            active   : this.active,
            bypass   : this.bypass,
        };
    }

    update(current: number, previous: number) {
        if (!this.active) return;

        //TODO: what happens when this.frequency < engine.frequency?
        this.#accumulator = this.#accumulator + (current - previous);

        if (this.#accumulator >= this.frequency) {
            this.value       += this.increment;
            this.#accumulator = 0;
        }

        if (!this.bypass && (this.value > this.cap)) {
            this.value = this.cap;
        }
    }

    static get type() { return 'counter';}
}