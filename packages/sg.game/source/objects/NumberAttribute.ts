import Drone from '@photon-rush/sg.game/source/objects/Drone';


export type NumberAttributeCalculation = ((drone: Drone) => number) | number;

export function calculate(nac: NumberAttributeCalculation, drone: Drone): number {
    if (typeof nac === 'number') return nac;

    return nac(drone);
}

export function clampZero(value: number): number {
    if (value < 0) return 0;

    return value;
}

export function clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;

    return value;
}

export default class NumberAttribute {
    readonly #owner: Drone;

    readonly #ceiling: NumberAttributeCalculation;
    #ceilingModifier : number;

    readonly #floor: NumberAttributeCalculation;
    #floorModifier : number;

    #current       : number;
    currentModifier: number;

    constructor(owner: Drone, current: number = 0, ceiling: NumberAttributeCalculation = Infinity, floor: NumberAttributeCalculation = 0) {
        this.#owner   = owner;
        this.#ceiling = ceiling;
        this.#floor   = floor;
        this.#current = current;

        this.#floorModifier   = 0;
        this.#ceilingModifier = 0;
        this.currentModifier  = 0;
    }

    get owner() {return this.#owner;}

    get ceiling() {
        return clampZero(calculate(this.#ceiling, this.#owner) - this.#ceilingModifier);
    }

    get floor() {
        return clampZero(calculate(this.#floor, this.#owner) - this.#floorModifier);
    }

    get current() {
        return this.#current + this.currentModifier;
    }

    setCurrent(value: number) {
        this.#current = clamp(this.#current + value, this.floor, this.ceiling);
    }

    setCurrentPercent(value: number) {
        const percent = clamp(value, -1, 1);

        const range = this.ceiling - this.floor;

        if (range === 0) return 0;

        this.setCurrent(percent * range);
    }

    setCurrentCeiling() {
        this.setCurrent(this.ceiling);
    }

    setCurrentFloor() {
        this.setCurrent(this.floor);
    }

    setCeilingModifier(value: number) {
        const max = clampZero(calculate(this.#ceiling, this.#owner));

        this.#ceilingModifier = clamp(value, 0, max);
    }

    setFloorModifier(value: number) {
        const max = clampZero(calculate(this.#floor, this.#owner));

        this.#floorModifier = clamp(value, 0, max);
    }


    setCeilingModifierPercent(value: number) {
        const percent = clamp(value, -1, 1);

        this.setCeilingModifier(percent * clampZero(calculate(this.#ceiling, this.#owner)));
    }

    setFloorModifierPercent(value: number) {
        const percent = clamp(value, -1, 1);

        this.setFloorModifier(percent * clampZero(calculate(this.#floor, this.#owner)));
    }

    toString() {
        return this.current.toString();
    }
}