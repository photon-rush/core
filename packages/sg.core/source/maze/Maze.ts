import {
    MazeCell,
    WallDirection,
    invertedWallCharacters,
    reverse,
} from '@photon-rush/sg.core/source/maze/MazeCell';

export class Maze {
    #grid   : Array<Array<MazeCell>>;
    #rows   : number;
    #columns: number;

    constructor(rows: number, columns: number, wallDefault: boolean = true ) {
        this.#grid    = [];
        this.#rows    = rows;
        this.#columns = columns;

        for (let row = 0; row < rows; row++) {
            this.#grid.push([]);

            for (let column = 0; column < columns; column++) {
                this.#grid[row].push(new MazeCell(row, column, wallDefault));
            }
        }
    }

    get rows() { return this.#rows; }
    get columns() { return this.#columns; }

    at(row: number, column: number): MazeCell | null {
        if (row >= this.#grid.length) return null;
        if (row < 0) return null;

        if (column >= this.#grid[row].length) return null;
        if (column < 0) return null;

        return this.#grid[row][column];
    }

    forEach(fn: (cell: MazeCell) => void) {
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                fn(this.#grid[row][column]);
            }
        }
    }

    link(row: number, column: number, direction: WallDirection) {
        const center   = this.at(row, column);
        const neighbor = this.getNeighbor(row, column, direction);

        if (!center) return;
        if (!neighbor) return;

        center[direction]            = false;
        neighbor[reverse[direction]] = false;
    }

    createRoom(row: number, column: number, width: number, height: number) {
        for (let rowOffset = 0; rowOffset < height; rowOffset++) {
            for (let columnOffset = 0; columnOffset < width; columnOffset++) {
                const current = this.at(row + rowOffset, column + columnOffset);
                if (!current) continue;

                const east  = this.getNeighbor(row + rowOffset, column + columnOffset, WallDirection.East);
                const south = this.getNeighbor(row + rowOffset, column + columnOffset, WallDirection.South);

                if (east && !(columnOffset === height - 1)) this.link(current.row, current.column, WallDirection.East);
                if (south && !(rowOffset === height - 1)) this.link(current.row, current.column, WallDirection.South);
            }
        }
    }

    getNeighbor(row: number, column: number, direction: WallDirection): MazeCell | null {
        let nRow    = row;
        let nColumn = column;

        switch (direction) {
        case WallDirection.North: nRow -= 1; break;
        case WallDirection.South: nRow += 1; break;
        case WallDirection.East: nColumn += 1; break;
        case WallDirection.West: nColumn -= 1; break;
        }

        return this.at(nRow, nColumn);
    }

    getNeighbors(row: number, column: number): Array<WallDirection> {
        const result:Array<WallDirection> = [];

        if (this.getNeighbor(row, column, WallDirection.North)) result.push(WallDirection.North);
        if (this.getNeighbor(row, column, WallDirection.South)) result.push(WallDirection.South);
        if (this.getNeighbor(row, column, WallDirection.East)) result.push(WallDirection.East);
        if (this.getNeighbor(row, column, WallDirection.West)) result.push(WallDirection.West);

        return result;
    }

    toString(): string {
        const result: Array<string> = [];

        for (let row = 0; row < this.rows; row++) {
            let line = '';

            for (let column = 0; column < this.columns; column++) {
                const cell = this.#grid[row][column];

                line += invertedWallCharacters[cell.walls];
            }

            result.push(line);
        }

        return result.join('\n');
    }


}