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

    constructor(row: number, column: number, wallDefault: boolean = true) {
        this[WallDirection.North] = wallDefault;
        this[WallDirection.South] = wallDefault;
        this[WallDirection.East]  = wallDefault;
        this[WallDirection.West]  = wallDefault;

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

export const reverse = {
    [WallDirection.North]: WallDirection.South,
    [WallDirection.South]: WallDirection.North,
    [WallDirection.East] : WallDirection.West,
    [WallDirection.West] : WallDirection.East,
};

export const invertedWallCharacters: Record<string, string> = {
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