import NumberAttribute, { clampZero } from '@photon-rush/sg.game/source/objects/NumberAttribute';

function speedFn(term1: number, term2: number): number {
    return Math.ceil(((term1 + term2) * 10) / 1000);
}

function statFn(term1: number): number {
    return (term1 + 1) * 100 / 2;
}

function calculateStat(drone: Drone) {
    return statFn(drone.level);
}

function calculateSpeed(drone: Drone): number {
    return speedFn(drone.perception.current, drone.capability.current);
}

function calculateSense(drone: Drone): number {
    return speedFn(drone.perception.current, drone.capability.current) * 4;
}


export default class Drone {
    #level    : number     = 0;
    name      : string       = '';
    experience: number = 0;

    health: number = 0;
    armor : number  = 0;
    shield: number = 0;

    readonly #speed       : NumberAttribute;
    readonly #sense       : NumberAttribute;
    readonly #capability  : NumberAttribute;
    readonly #perception  : NumberAttribute;
    readonly #intelligence: NumberAttribute;
    readonly #gumption    : NumberAttribute;


    constructor(name: string = '', level: number = 0) {
        this.name = name;

        this.#speed        = new NumberAttribute(this, 0, calculateSpeed);
        this.#sense        = new NumberAttribute(this, 0, calculateSense);
        this.#capability   = new NumberAttribute(this, 0, calculateStat);
        this.#perception   = new NumberAttribute(this, 0, calculateStat);
        this.#intelligence = new NumberAttribute(this, 0, calculateStat);
        this.#gumption     = new NumberAttribute(this, 0, calculateStat);

        this.level = level;
    }

    get level() {return this.#level;}

    set level(value: number) {
        this.#level = clampZero(value);

        this.capability.setCurrentCeiling();
        this.perception.setCurrentCeiling();
        this.intelligence.setCurrentCeiling();
        this.gumption.setCurrentCeiling();

        this.speed.setCurrentCeiling();
        this.sense.setCurrentCeiling();

    }

    /**
     * A pool of energy for powering tools and equipment
     */
    get battery(): number {
        return 100;
    }

    /**
     * The amount of weight the drone can store in its inventory
     */
    get capacity(): number {
        return 100;
    }

    /**
     * The total number of equipment the drone can equip at once.
     */
    get equipmentSlots(): number {
        return 4;
    }

    /**
     * The total number of tools the drone can equip at once.
     */
    get toolSlots(): number {
        return 1;
    }

    /**
     * The number of tiles the drone can travel per second
     */
    get speed() {
        return this.#speed;
    }

    /**
     * The number of tiles the drone look at per second
     */
    get sense() { return this.#sense; }

    /**
     * A general value that influences actions that require changing the world
     */
    get capability() { return this.#capability; }

    /**
     * A general value that influences actions that require perceiving the world
     */
    get perception() { return this.#perception; }

    /**
     * A general value that influences actions that require understanding the world
     */
    get intelligence() { return this.#intelligence; }

    /**
     * A general value that influences all actions
     */
    get gumption() { return this.#gumption; }


    toStatsString() {
        const level        = this.level.toString().padStart(4, '0');
        const speed        = this.speed.toString().padStart(4, '0');
        const sense        = this.sense.toString().padStart(4, '0');
        const capability   = this.capability.toString().padStart(4, '0');
        const perception   = this.perception.toString().padStart(4, '0');
        const intelligence = this.intelligence.toString().padStart(4, '0');
        const gumption     = this.gumption.toString().padStart(4, '0');

        return `[L:${level}][S:${speed} (${sense}) ][C:${capability}][P:${perception}][I:${intelligence}][G:${gumption}]`;
    }


}