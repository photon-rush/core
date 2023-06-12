import { IPhotonObject, ISimplePhotonObject } from '@photon-rush/sg.core/source/photon/IPhotonObject';

export interface IPoint {
    x: number,
    y: number,
}

export enum CardinalDirection {
    North = 'n',
    East  = 'e',
    South = 's',
    West  = 'w',

    Equal   = 'eq',
    Unknown = 'uk',
}

export enum Direction {
    North = CardinalDirection.North,
    East  = CardinalDirection.East,
    South = CardinalDirection.South,
    West  = CardinalDirection.West,

    NorthEast = 'ne',
    SouthEast = 'se',
    SouthWest = 'sw',
    NorthWest = 'nw',

    Equal   = CardinalDirection.Equal,
    Unknown = CardinalDirection.Unknown,

}

export const reversedDirection = Object.freeze({
    [Direction.North]: Direction.South,
    [Direction.East] : Direction.West,
    [Direction.South]: Direction.North,
    [Direction.West] : Direction.East,

    [Direction.NorthEast]: Direction.SouthWest,
    [Direction.SouthEast]: Direction.NorthWest,
    [Direction.SouthWest]: Direction.NorthEast,
    [Direction.NorthWest]: Direction.SouthWest,

    [Direction.Unknown]: Direction.Unknown,
    [Direction.Equal]  : Direction.Equal,

    [CardinalDirection.North]: CardinalDirection.South,
    [CardinalDirection.East] : CardinalDirection.West,
    [CardinalDirection.South]: CardinalDirection.North,
    [CardinalDirection.West] : CardinalDirection.East,

    [CardinalDirection.Unknown]: CardinalDirection.Unknown,
    [CardinalDirection.Equal]  : CardinalDirection.Equal,
});

export function isCardinal(value?: string | null): boolean {
    if (!value) return false;

    if (value === CardinalDirection.North) return true;
    if (value === CardinalDirection.East) return true;
    if (value === CardinalDirection.South) return true;
    if (value === CardinalDirection.West) return true;

    return false;
}

export default class Point implements IPhotonObject<IPoint>, IPoint {
    static readonly #_zero: Point = new Point();

    static readonly #_neighbors: Record<Direction, Point> = {
        [Direction.North]    : new Point(0, -1),
        [Direction.NorthEast]: new Point(1, -1),
        [Direction.East]     : new Point(1, 0),
        [Direction.SouthEast]: new Point(1, 1),
        [Direction.South]    : new Point(0, 1),
        [Direction.SouthWest]: new Point(-1, 1),
        [Direction.West]     : new Point(-1, 0),
        [Direction.NorthWest]: new Point(-1, -1),
        [Direction.Equal]    : new Point(0, 0),
        [Direction.Unknown]  : new Point(NaN, NaN),
    };

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

    get x() { return this.#_x; }

    get y() { return this.#_y; }

    get id() {return `x${this.x}y${this.y}`;}

    get neighbors() {
        return [
            this.getNeighbor(Direction.North),
            this.getNeighbor(Direction.NorthEast),
            this.getNeighbor(Direction.East),
            this.getNeighbor(Direction.SouthEast),
            this.getNeighbor(Direction.South),
            this.getNeighbor(Direction.SouthWest),
            this.getNeighbor(Direction.West),
            this.getNeighbor(Direction.NorthWest),
        ];
    }

    get cardinalNeighbors() {
        return [
            this.getNeighbor(Direction.North),
            this.getNeighbor(Direction.East),
            this.getNeighbor(Direction.South),
            this.getNeighbor(Direction.West),
        ];
    }

    getNeighbor(direction: Direction | CardinalDirection) {
        return this.add(Point.#_neighbors[direction]);
    }

    getDirection(point: IPoint): Direction {
        if (this.equals(point)) return Direction.Equal;
        let cx = '';
        let cy = '';

        if (point.x < this.x) {
            cx = 'w';
        } else if (point.x > this.x) {
            cx = 'e';
        }

        if (point.y < this.y) {
            cy = 'n';
        } else if (point.y > this.y) {
            cy = 's';
        }

        return (cy + cx) as Direction;
    }

    getCardinalDirection(point: IPoint): CardinalDirection {
        if (this.equals(point)) return CardinalDirection.Equal;
        let cx = '';
        let cy = '';

        if (point.x < this.x) {
            cx = 'w';
        } else if (point.x > this.x) {
            cx = 'e';
        }

        if (point.y < this.y) {
            cy = 'n';
        } else if (point.y > this.y) {
            cy = 's';
        }

        const value = cy + cx;

        if (isCardinal(value)) {
            return value as CardinalDirection;
        } else {
            throw new Error('Invalid direction');
        }
    }

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

    static createGrid(size: number): Array<Point> {
        const result: Array<Point> = [];

        for (let height = 0; height < size; height++) {
            for (let width = 0; width < size; width++) {
                result.push(new Point(width, height));
            }
        }

        return result;
    }

    static get type() { return 'point';}

    static get zero() { return this.#_zero; }
}