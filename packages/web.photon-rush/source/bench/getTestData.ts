const LIMIT = 5000000;

export interface ITestData {
    array : Array<number>,
    object: Record<string, number>,
}

export default function getTestData(): ITestData {
    console.log('Getting test data...');

    const array: Array<number>           = [];
    const object: Record<string, number> = {};

    for (let j = 0; j < LIMIT; j++) {
        array.push(j);
        object[`__key[${j}]__`] = j;
    }

    return { array, object };
}