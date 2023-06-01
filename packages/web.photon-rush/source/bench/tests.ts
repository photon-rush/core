import {ITestData} from '@photon-rush/web.photon-rush/source/bench/getTestData';

export function testForLoop(data: Array<number>) {
    let acc = 0;

    for (let j = 0; j < data.length; j++) {
        acc = data[j];
    }
}


export function testForEachLoop(data: Array<number>) {
    let acc = 0;

    data.forEach(i => acc = i);
}

export function testForOfLoop(data: Array<number>) {
    let acc = 0;

    for (const i of data) {
        acc = i;
    }
}