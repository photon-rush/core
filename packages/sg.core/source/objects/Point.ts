import {IPhotonObject, ISimplePhotonObject} from '@photon-rush/sg.core/source/photon/IPhotonObject';

export interface IPoint {
    x: number;
    y: number;
}

export default class Point implements IPhotonObject<IPoint>, IPoint {
    static readonly #_zero: Point = new Point();

    readonly #_x: number;
    readonly #_y: number;

    constructor(x: IPoint | number = 0, y: number = 0) {
        if (typeof x === 'number') {
            this.#_x = x;
            this.#_y = y;
        } else {
            this.#_x = x.x;
            this.#_y = x.y;
        }
    }

    get x() {return this.#_x;}

    get y() {return this.#_y;}

    add(point: Point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    simplify(): IPoint {
        return {
            x: this.x,
            y: this.y,
        };
    }

    save(): ISimplePhotonObject & IPoint {
        return {
            type: Point.type,
            ...this.simplify(),
        };
    }

    copy(): Point {
        return new Point(this);
    }

    equals(o?: IPoint | null | undefined): boolean {
        if (!o) return false;

        return this.x === o.x && this.y === o.y;
    }

    static get type() { return 'point';}

    static get zero() {
        return this.#_zero;
    }
}