export type SequenceFn = () => void | number;

export default function sequence(functions: Iterable<SequenceFn> | ArrayLike<SequenceFn>, delay: number = 1000, complete?: () => void) {
    const list = Array.from(functions);

    const loop = () => {
        const current = list.shift();

        if (current) {
            const variance = current() || 0;
            setTimeout(loop, delay + variance);
        } else {
            if (complete) complete();

            return;
        }
    };

    setTimeout(loop, delay);
}