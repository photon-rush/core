export default function pathSplit(path: string) {
    const first = path.split('/');

    const result: Array<string> = [];
    for (let j = 0; j < first.length; j++) {
        result.push(...first[j].split('\\'));
    }

    return result;
}