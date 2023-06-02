import { readdir } from 'fs-extra';

import { IRepository } from '@photon-rush/automation.environment/lib/repository/createRepository';

import { IContext } from '@photon-rush/automation.environment/lib/createContext';
import createPackage, { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import { resolvePathArray } from '@photon-rush/automation.environment/lib/resolvePaths';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';

export interface IPackages {
    list      : Array<IPackage>,
    invalid   : Array<IPackage>,
    byName    : Map<string, IPackage>,
    byLocation: Map<string, IPackage>,
}

export default async function createPackages(repository: IRepository, context: IContext, status: StatusCollection): Promise<IPackages> {
    const state = {
        context,
        repository,
        status,
    };

    const packages = resolvePathArray(repository.paths.packages, await readdir(repository.paths.packages));

    const result: IPackages = {
        list      : [],
        byName    : new Map(),
        byLocation: new Map(),
        invalid   : [],
    };

    for (let j = 0; j < packages.length; j++) {
        const packageInformation = await createPackage(packages[j], state);

        if (packageInformation.valid) {
            result.list.push(packageInformation);
            result.byName.set(packageInformation.meta.name, packageInformation);
            result.byLocation.set(packageInformation.location, packageInformation);
        } else {
            result.invalid.push(packageInformation);
        }
    }

    return result;
}