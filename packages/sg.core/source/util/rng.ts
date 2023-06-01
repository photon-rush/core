export function getRandomInt(minimum: number, maximum: number) {
    const min = Math.ceil(minimum);
    const max = Math.floor(maximum);

    return Math.floor(Math.random() * (max - min) + min);
}

export function pick<T = unknown>(array: Array<T>): T {
    return array[getRandomInt(0, array.length)];
}