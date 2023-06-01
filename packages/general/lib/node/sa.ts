import { resolve } from 'path';

export const scope = '@photon-rush';
export const root = resolve(__dirname, '../../..');
export const workspace = resolve(root, './packages');

/**
 * sa - Scope Absolute
 * Translates a scope relative path to an absolute file system path. The format of this path should be @photon-rush/{package}/{path}
 *
 * __Notes__
 * npm and many other tools do this already, this is mostly for when you need to use a file API to access a file in the repo.
 * @param p The absolute path to translate.
 * @returns A valid file system path.
 */
export default function sa(p: string): string {
    const data = pathSplit(p);

    if (data.length === 0) throw new Error(`Cannot create real path for ${p}.`);
    if (data[0] !== scope) throw new Error(`Path ${p} must start with ${scope}`);
    if (data.length === 1) return root;

    const packageLocation = resolve(workspace, data[1]);

    if (data.length === 2) return packageLocation;

    return resolve(packageLocation, data.slice(2).join('/'));
}

function pathSplit(path: string) {
    const first = path.split('/');

    const result: Array<string> = [];
    for (let j = 0; j < first.length; j++) {
        result.push(...first[j].split('\\'));
    }

    return result;
}