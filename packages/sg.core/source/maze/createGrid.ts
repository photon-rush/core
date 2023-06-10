import { MazeCellType } from '@photon-rush/sg.core/source/maze';
import BuilderMazeCell from '@photon-rush/sg.core/source/maze/BuilderMazeCell';
import SquareGrid from '@photon-rush/sg.core/source/objects/SquareGrid';

export default function createGrid(grid:  SquareGrid<BuilderMazeCell>):  SquareGrid<MazeCellType> {
    const result = new SquareGrid(grid.size * grid.size, MazeCellType.Masked);


    return result;
}