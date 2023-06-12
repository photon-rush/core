import Random from '@photon-rush/general/lib/Random';
import { MazeCell, Maze } from '@photon-rush/sg.core/source/maze/Maze';

/**
 * Creates an square maze biased toward long passages.
 * @param size The height and width of the maze.
 * @param random The PRNG to use when generating the maze
 */
export default function recursiveBacktracker(maze: Maze, random: Random) {
    const start = maze.at(random.withinNumber(0, maze.rows - 1), random.withinNumber(0, maze.columns - 1))!;

    const stack: Array<MazeCell> = [start];

    while (stack.length > 0) {
        const current = stack[stack.length - 1];

        const neighbors = maze.getNeighbors(current.row, current.column)
            .map(direction => ({ direction, cell: maze.getNeighbor(current.row, current.column, direction)! }))
            .filter(c => !c.cell.visited)
            ;

        if (neighbors.length === 0) {
            stack.pop();
        } else {
            const { direction, cell } = random.pick(neighbors);

            maze.link(current.row, current.column, direction);
            cell.visited = true;
            stack.push(cell);
        }
    }
}