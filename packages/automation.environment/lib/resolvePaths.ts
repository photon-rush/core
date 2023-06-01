import { resolve } from 'path';

export function resolvePaths(location: string, paths: Array<string>): Array<string> {
    const result: Array<string> = [];

    for (let j = 0; j < paths.length; j++) {
        result.push(resolve(location, paths[j]));
    }

    return result;
}