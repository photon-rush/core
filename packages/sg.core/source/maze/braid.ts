import Random from '@photon-rush/general/lib/Random';
import BuilderMazeCell from '@photon-rush/sg.core/source/maze/BuilderMazeCell';
import SquareGrid from '@photon-rush/sg.core/source/objects/SquareGrid';

/**
 * Removes all dead ends from a maze by picking a random neighbor to link to
 * @param grid The maze to braid
 * @param random The PRNG to use when generating the maze
 * @returns
 */
export default function braid(grid: SquareGrid<BuilderMazeCell>, random: Random): SquareGrid<BuilderMazeCell> {
    grid.forEach(cell => {
        if (cell.value.isDeadEnd) {
            const next = random.pick(grid
                .getValidCardinalNeighbors(cell.location)
                .filter(n => !n.value.visited)
            );

            cell.value.link(cell.location.getCardinalDirection(next.location), next.value);
        }
    });

    return grid;
}