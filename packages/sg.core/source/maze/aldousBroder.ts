import Random from '@photon-rush/general/lib/Random';
import { Maze } from '@photon-rush/sg.core/source/maze/Maze';


/**
 * Creates an unbiased square maze.
 * Aldous-Broder basically just randomly walks over the grid so its not suitable for big mazes.
 * @param size The height and width of the maze.
 * @param random The PRNG to use when generating the maze
 */
export default function aldousBroder(maze: Maze, random: Random) {
    const total   = maze.rows * maze.columns;
    const visited = new Set<string>();

    let current     = maze.at(random.withinNumber(0, maze.rows - 1), random.withinNumber(0, maze.columns - 1))!;
    current.visited = true;
    visited.add(current.key);

    while (visited.size < total) {
        const direction = random.pick(maze.getNeighbors(current.row, current.column));
        const next      = maze.getNeighbor(current.row, current.column, direction)!;

        if (!next.visited) maze.link(current.row, current.column, direction);

        current         = next;
        current.visited = true;
        visited.add(current.key);
    }
}