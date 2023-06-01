import getTestData, {ITestData} from '@photon-rush/web.photon-rush/source/bench/getTestData';
import {testForEachLoop, testForLoop, testForOfLoop} from '@photon-rush/web.photon-rush/source/bench/tests';

interface ITestResult {
    delta: number,
    name: string
}

async function runTest(element: HTMLElement | null, name: string, fn: (data: Array<number>) => void) {
    let testData: ITestData | null = null;

    return new Promise(resolve => {
        setTimeout(() => {
            if (!testData) testData = getTestData();

            const start = performance.now();
            console.log(`Started ${name}: ${start}`);

            fn(testData.array);

            const end = performance.now();
            console.log(`Ended ${name}: ${end}`);

            const result = {
                name,
                delta: end - start,
            };

            if (element) report(element, result);

            resolve(result);
        });
    });
}

function report(element: HTMLElement, results: ITestResult) {
    element.innerHTML = `<p>Completed in ${results.delta}</p>`;
}


export default async function bench() {
    const forElement     = document.getElementById('testForLoop');
    const forEachElement = document.getElementById('testForEachLoop');
    const forOfElement   = document.getElementById('testForOfLoop');


    runTest(forElement, 'for', testForLoop);
    runTest(forEachElement, 'for-each', testForEachLoop);
    runTest(forOfElement, 'for-of', testForOfLoop);


}