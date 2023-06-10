import Random from '@photon-rush/general/lib/Random';
import BuilderMazeCell from '@photon-rush/sg.core/source/maze/BuilderMazeCell';
import Point from '@photon-rush/sg.core/source/objects/Point';
import SquareGrid from '@photon-rush/sg.core/source/objects/SquareGrid';

/**
 * Creates an square maze biased toward long passages.
 * @param size The height and width of the maze.
 * @param random The PRNG to use when generating the maze
 */
export default function recursiveBacktracker(size: number, random: Random): SquareGrid<BuilderMazeCell> {
    const grid  = new SquareGrid(size, new BuilderMazeCell());
    const start = new Point(random.withinNumber(0, size - 1), random.withinNumber(0, size - 1));

    const stack: Array<{
        location: Point,
        value   : BuilderMazeCell,
    }> = [grid.get(start)];

    while (stack.length > 0) {
        const neighbors = grid
            .getValidCardinalNeighbors(stack[stack.length - 1].location)
            .filter(n => !n.value.visited)
            ;

        if (neighbors.length === 0) {
            stack.pop();
        } else {
            const next = random.pick(neighbors);

            stack[stack.length - 1].value.link(stack[stack.length - 1].location.getCardinalDirection(next.location), next.value);
            stack.push(stack[stack.length - 1]);
        }
    }

    return grid;
}