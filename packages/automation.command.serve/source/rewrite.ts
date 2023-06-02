import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import pathSplit from '@photon-rush/general/lib/node/pathSplit';
import { existsSync } from 'fs-extra';
import { resolve } from 'path';

function exists(url: string, environment: IEnvironment) {
    return existsSync(resolve(environment.repository.location, url));
}

export default function rewrite(original: string, environment: IEnvironment): string {
    const components = pathSplit(original);

    if (components[1] !== '@photon-rush') return original;

    const packageName = components[2];
    const resource    = components.slice(3).join('/');

    const candidate1 = ['packages', packageName, '-output', resource].join('/');
    const candidate2 = ['packages', packageName, resource].join('/');

    if (exists(candidate1, environment)) return candidate1;

    return candidate2;
}