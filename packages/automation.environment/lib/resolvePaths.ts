import { resolve } from 'path';

export function resolvePathArray(location: string, paths: Array<string>): Array<string> {
    const result: Array<string> = [];

    for (let j = 0; j < paths.length; j++) {
        result.push(resolve(location, paths[j]));
    }

    return result;
}

export function resolvePathRecord(location: string, paths: Record<string, string>): Record<string, string> {
    const result: Record<string, string> = {};

    const keys = Object.getOwnPropertyNames(paths);

    for (let j = 0; j < keys.length; j++) {
        result[keys[j]] = resolve(location, paths[keys[j]]);
    }

    return result;
}