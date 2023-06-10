import { CardinalDirection, reversedDirection } from '@photon-rush/sg.core/source/objects/Point';

export default class MazeCell {
    visited: boolean;
    links: {
        [CardinalDirection.North]  : MazeCell | null,
        [CardinalDirection.South]  : MazeCell | null,
        [CardinalDirection.East]   : MazeCell | null,
        [CardinalDirection.West]   : MazeCell | null,
        [CardinalDirection.Equal]  : MazeCell,
        [CardinalDirection.Unknown]: null,
    };

    constructor() {
        this.visited = false;
        this.links   = {
            [CardinalDirection.North]  : null,
            [CardinalDirection.South]  : null,
            [CardinalDirection.East]   : null,
            [CardinalDirection.West]   : null,
            [CardinalDirection.West]   : null,
            [CardinalDirection.West]   : null,
            [CardinalDirection.Equal]  : this,
            [CardinalDirection.Unknown]: null,
        };
    }


    link(direction: CardinalDirection, cell: MazeCell) {
        if (direction === CardinalDirection.Equal) return;
        if (direction === CardinalDirection.Unknown) return;

        this.links[direction] = cell;

        cell.link(reversedDirection[direction], this);
    }

    unlink(direction: CardinalDirection) {
        if (direction === CardinalDirection.Equal) return;
        if (direction === CardinalDirection.Unknown) return;

        this.links[direction]?.unlink(reversedDirection[direction]);
        this.links[direction] = null;
    }

    get isDeadEnd() {
        let counter = 0;
        for (const [, value] of Object.entries(this.links)) {
            if (value) counter++;

            if (counter > 1) return true;
        }

        return counter === 1;
    }
}