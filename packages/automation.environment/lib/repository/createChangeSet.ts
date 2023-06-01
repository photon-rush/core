import { relative, resolve, sep } from 'path';

export interface IChangeSet {
    packages: Set<string>,
    global  : boolean,
}

export default function createChangeSet(packageDirectory: string, changes?: Array<string> | null): IChangeSet {
    if (!changes) {
        return {
            packages: new Set(),
            global  : true,
        };
    }

    const automationPrefix      = resolve(packageDirectory, 'automation');
    const packages: Set<string> = new Set();

    let global = false;

    for (let j = 0; j < changes.length; j++) {
        if (changes[j].startsWith(automationPrefix)) {
            global = true;
        }

        if (changes[j].startsWith(packageDirectory)) {
            const directory = relative(packageDirectory, changes[j]);
            const name      = directory.slice(0, directory.indexOf(sep));

            packages.add(resolve(packageDirectory, name));
        } else {
            global = true;
        }
    }

    return {
        packages,
        global,
    };
}