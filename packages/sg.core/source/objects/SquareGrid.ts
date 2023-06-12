import Point from '@photon-rush/sg.core/source/objects/Point';

export interface ISquareGridEntry<T> {
    location: Point,
    value   : T,
}

export default class SquareGrid<T> {
    readonly #_cells: Map<string, ISquareGridEntry<T>>;
    readonly #_size : number;

    constructor(size: number, empty: T) {
        this.#_size  = size;
        this.#_cells = new Map();

        this.initialize(empty);
    }

    get size() { return this.#_size; }

    initialize(empty: T) {
        this.#_cells.clear();

        Point.createGrid(this.#_size)
            .forEach(location => {
                this.#_cells.set(location.id, {
                    location,
                    value: empty,
                });
            });
    }

    get(location: Point) {
        return {
            location: this.#_cells.get(location.id)!.location,
            value   : this.#_cells.get(location.id)!.value,
        };
    }

    getValidNeighbors(location: Point) {
        const center = this.#_cells.get(location.id)?.location;

        if (!center) return [];

        return center.neighbors
            .filter(cell => this.validate(cell))
            .map(point => this.get(point))
        ;
    }

    getValidCardinalNeighbors(location: Point) {
        const center = this.#_cells.get(location.id)?.location;

        if (!center) return [];


        return center.neighbors
            .filter(cell => this.validate(cell))
            .map(point => this.get(point))
        ;
    }

    validate(location: Point) {
        if (location.x < 0) return false;
        if (location.y < 0) return false;

        if (location.x >= this.size) return false;
        if (location.y >= this.size) return false;

        return true;
    }

    /**
     * Iterates through each point in the grid. Starts at the top left (extreme north west) of the grid
     * @param fn the function to call for each cell
     */
    forEach(fn: (entry: ISquareGridEntry<T>) => void) {
        Point.createGrid(this.#_size)
            .forEach(location => {
                fn(this.get(location)); //TODO: make this a for loop like the 'createGrid' implementation
            });
    }

    [Symbol.iterator]() {
        return this.#_cells.values();
    }

}