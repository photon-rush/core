import Random from '@photon-rush/general/lib/Random';
import BuilderMazeCell from '@photon-rush/sg.core/source/maze/BuilderMazeCell';
import SquareGrid from '@photon-rush/sg.core/source/objects/SquareGrid';


export enum MazeCellType {
    Empty   = 'empty',
    Blocked = 'blocked',
    Masked  = 'masked',
}

export type MazeGenerator = (size: number, random: Random) => SquareGrid<BuilderMazeCell>;

export default function createMaze(generator: MazeGenerator, size: number, random: Random) {
    const grid = generator(size, random);
}