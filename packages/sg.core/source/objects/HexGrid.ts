import HexPoint from '@photon-rush/sg.core/source/objects/HexPoint';

export interface IHexGridEntry<T> {
    location: HexPoint,
    value   : T,
}

export default class HexGrid<T> {
    readonly #_cells: Map<string, IHexGridEntry<T>>;
    readonly #_size : number;

    constructor(size: number, empty: T) {
        this.#_size  = size;
        this.#_cells = new Map();

        this.initialize(empty);
    }

    initialize(empty: T) {
        this.#_cells.clear();

        HexPoint.createGrid(this.#_size)
            .forEach(location => {
                this.#_cells.set(location.id, {
                    location,
                    value: empty,
                });
            });
    }

    get(location: HexPoint) {
        return {
            location: this.#_cells.get(location.id)!.location,
            value   : this.#_cells.get(location.id)!.value,
        };
    }

    /**
     * Iterates through each hex in the grid. Starts in the center and works outward.
     * @param fn the function to call for each cell
     */
    forEach(fn: (entry: IHexGridEntry<T>) => void) {
        HexPoint.createGrid(this.#_size)
            .forEach(location => {
                fn(this.get(location)); //TODO: make this a for loop like the 'createGrid' implementation
            });
    }

}