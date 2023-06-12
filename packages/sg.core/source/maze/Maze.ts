export enum WallDirection {
    North = 'n',
    South = 's',
    East  = 'e',
    West  = 'w',
}

export class MazeCell {
    #row   : number;
    #column: number;
    #key   : string;

    [WallDirection.North]: boolean;
    [WallDirection.South]: boolean;
    [WallDirection.East] : boolean;
    [WallDirection.West] : boolean;

    visited: boolean;

    constructor(row: number, column: number) {
        this[WallDirection.North] = true;
        this[WallDirection.South] = true;
        this[WallDirection.East]  = true;
        this[WallDirection.West]  = true;

        this.#row    = row;
        this.#column = column;
        this.#key    = `r${row}c${column}`;

        this.visited = false;
    }

    get key() { return this.#key; }
    get row() { return this.#row; }
    get column() { return this.#column; }
    get walls(): string {
        let result = '';

        result += this[WallDirection.North] ? 'n' : '-';
        result += this[WallDirection.South] ? 's' : '-';
        result += this[WallDirection.East] ? 'e' : '-';
        result += this[WallDirection.West]  ? 'w' : '-';

        return result;
    }
    get deadEnd() {
        let counter = 0;

        if (this[WallDirection.North]) counter++;
        if (this[WallDirection.South]) counter++;
        if (this[WallDirection.East]) counter++;
        if (this[WallDirection.West]) counter++;

        return counter <= 1;
    }
}

const reverse = {
    [WallDirection.North]: WallDirection.South,
    [WallDirection.South]: WallDirection.North,
    [WallDirection.East] : WallDirection.West,
    [WallDirection.West] : WallDirection.East,
};

const invertedWallCharacters: Record<string, string> = {
    ['nsew']: ' ',
    ['nse-']: '╴',
    ['ns-w']: '╶',
    ['ns--']: '─',
    ['n-ew']: ' ',
    ['n-e-']: '┐',
    ['n--w']: '┌',
    ['n---']: '┬',
    ['-sew']: '╵',
    ['-se-']: '┘',
    ['-s-w']: '└',
    ['-s--']: '┴',
    ['--ew']: '│',
    ['--e-']: '┤',
    ['---w']: '├',
    ['----']: '┼',
};

export class Maze {
    #grid   : Array<Array<MazeCell>>;
    #rows   : number;
    #columns: number;

    constructor(rows: number, columns: number) {
        this.#grid    = [];
        this.#rows    = rows;
        this.#columns = columns;

        for (let row = 0; row < rows; row++) {
            this.#grid.push([]);

            for (let column = 0; column < columns; column++) {
                this.#grid[row].push(new MazeCell(row, column));
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