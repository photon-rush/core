import Point from '@photon-rush/sg.core/source/objects/Point';
import {IPhotonObject, ISimplePhotonObject} from '@photon-rush/sg.core/source/photon/IPhotonObject';

const layoutMatrix = Object.freeze({
    f0: 3 / 2,
    f1: 0,
    f2: Math.sqrt(3) / 2,
    f3: Math.sqrt(3),

    b0: 2 / 3,
    b1: 0,
    b2: -1 / 3,
    b3: Math.sqrt(3) / 3,

    angle: 0,
});

export interface IHexPoint {
    q: number;
    r: number;
}


export enum HexDirection {
    NORTH      = 0,
    NORTH_EAST = 1,
    SOUTH_EAST = 2,
    SOUTH      = 3,
    SOUTH_WEST = 4,
    NORTH_WEST = 5,
}

export default class HexPoint implements IPhotonObject<IHexPoint>, IHexPoint {

    //Given a direction get the neighbors
    static readonly #_neighbors: ReadonlyArray<HexPoint> = [
        new HexPoint(0, -1),
        new HexPoint(1, -1),
        new HexPoint(1, 0),
        new HexPoint(0, 1),
        new HexPoint(-1, 1),
        new HexPoint(-1, 0),
    ];

    //The order of neighbors for moving around a ring clockwise.
    static readonly #_ring: ReadonlyArray<HexDirection> = [
        HexDirection.SOUTH_EAST,
        HexDirection.SOUTH,
        HexDirection.SOUTH_WEST,
        HexDirection.NORTH_WEST,
        HexDirection.NORTH,
        HexDirection.NORTH_EAST,
    ];

    static readonly #_zero: HexPoint = new HexPoint();

    readonly #_q: number;
    readonly #_r: number;

    constructor(q: IHexPoint | number = 0, r: number = 0) {
        if (typeof q === 'number') {
            this.#_q = q;
            this.#_r = r;
        } else {
            this.#_q = q.q;
            this.#_r = q.r;
        }
    }

    get q() {return this.#_q;}

    get r() {return this.#_r;}

    getDirection(direction: HexDirection) {
        return this.add(HexPoint.#_neighbors[direction]);
    }

    add(point: HexPoint) {
        return new HexPoint(this.q + point.q, this.r + point.r);
    }

    scale(factor: number = 1) {
        return new HexPoint(this.q * factor, this.r * factor);
    }

    simplify(): IHexPoint {
        return {
            q: this.q,
            r: this.r,
        };
    }

    save(): ISimplePhotonObject & IHexPoint {
        return {
            type: HexPoint.type,
            ...this.simplify(),
        };
    }

    copy(): HexPoint {
        return new HexPoint(this);
    }

    equals(o?: IHexPoint | null | undefined): boolean {
        if (!o) return false;

        return this.q === o.q && this.r === o.r;
    }

    getCenterPixel(size: Point = new Point(32, 32), origin: Point = Point.zero): Point {
        const x = (layoutMatrix.f0 * this.q + layoutMatrix.f1 * this.r) * size.x;
        const y = (layoutMatrix.f2 * this.q + layoutMatrix.f3 * this.r) * size.y;

        return new Point(Math.round(x), Math.round(y)).add(origin);
    }


    #_getVertexPixel(vertex: number, size: Point, origin: Point, center: Point): Point {
        const angle = (Math.PI / 180) * (60 * vertex);

        const x = center.x + (size.x * Math.cos(angle));
        const y = center.y + (size.y * Math.sin(angle));

        return new Point(Math.round(x), Math.round(y));
    }

    getVertexPixel(vertex: number, size: Point = new Point(32, 32), origin: Point = Point.zero): Point {
        const center = this.getCenterPixel(size, origin);

        return this.#_getVertexPixel(vertex, size, origin, center);
    }

    getVertices(size: Point = new Point(32, 32), origin: Point = Point.zero): Array<Point> {
        const center = this.getCenterPixel(size, origin);

        return [
            this.#_getVertexPixel(0, size, origin, center),
            this.#_getVertexPixel(1, size, origin, center),
            this.#_getVertexPixel(2, size, origin, center),
            this.#_getVertexPixel(3, size, origin, center),
            this.#_getVertexPixel(4, size, origin, center),
            this.#_getVertexPixel(5, size, origin, center),
        ];
    }

    get id() {return `q${this.q}r${this.r}`;}

    toString() {
        return `(${this.id})`;
    }

    toPointsString(size: Point = new Point(32, 32), origin: Point = Point.zero) {
        const points = this.getVertices(size, origin);

        return points
            .map(p => `${p.x},${p.y}`)
            .join(' ')
            ;
    }

    static get zero() {
        return this.#_zero;
    }

    static createRing(ring: number = 1): Array<HexPoint> {
        if (ring <= 0) return [this.zero];

        const result: Array<HexPoint> = [];

        let current = this.#_neighbors[HexDirection.NORTH].scale(ring);

        for (let direction = 0; direction < 6; direction++) {
            for (let index = 0; index < ring; index++) {
                result.push(current);
                current = current.getDirection(this.#_ring[direction]);
            }
        }

        return result;
    }

    static createGrid(rings: number = 1): Array<HexPoint> {
        const result: Array<HexPoint> = [];

        for (let ring = 0; ring <= rings; ring++) {
            result.push(...this.createRing(ring));
        }

        return result;
    }

    static get type() { return 'hexPoint';}
}