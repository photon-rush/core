import Random from '@photon-rush/general/lib/Random';
import BuilderMazeCell from '@photon-rush/sg.core/source/maze/BuilderMazeCell';

import Point from '@photon-rush/sg.core/source/objects/Point';
import SquareGrid from '@photon-rush/sg.core/source/objects/SquareGrid';

/**
 * Creates an unbiased square maze.
 * Aldous-Broder basically just randomly walks over the grid so its not suitable for big mazes.
 * @param size The height and width of the maze.
 * @param random The PRNG to use when generating the maze
 */
export default function aldousBroder(size: number, random: Random): SquareGrid<BuilderMazeCell> {
    const grid  = new SquareGrid(size, new BuilderMazeCell());
    const start = new Point(random.withinNumber(0, size - 1), random.withinNumber(0, size - 1));
    const total = size * size;

    const visited = new Set<string>();
    let current   = grid.get(start);

    current.value.visited = true;
    visited.add(current.location.id);

    while (visited.size < total) {
        const next          = random.pick(grid.getValidCardinalNeighbors(current.location));
        const nextDirection = current.location.getCardinalDirection(next.location);

        if (next.value.visited) current.value.link(nextDirection, next.value);

        current               = next;
        current.value.visited = true;
        visited.add(current.location.id);
    }

    return grid;
}