import { resolve } from 'path';

import createContext, { IContext } from '@photon-rush/automation.environment/lib/createContext';
import createPackages, { IPackages } from '@photon-rush/automation.environment/lib/packages/createPackages';
import createRepository, { IRepository } from '@photon-rush/automation.environment/lib/repository/createRepository';
import createCommands, { ICommands } from '@photon-rush/automation.environment/lib/command/createCommands';
import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import findLocalPackage from '@photon-rush/automation.environment/lib/findLocalPackage';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';

const location = resolve(__dirname, '../../..' );

export interface IEnvironment {
    get status(): StatusCollection,

    time      : Date,
    context   : IContext,
    repository: IRepository,
    packages  : IPackages,
    commands  : ICommands,
    local?    : IPackage,
}

export default async function createEnvironment(): Promise<IEnvironment> {
    const status = new StatusCollection();

    const time       = new Date();
    const context    = createContext(location);
    const repository = await createRepository(location);
    const packages   = await createPackages(repository, context, status);
    const commands   = createCommands(packages.list);

    const environment: IEnvironment = {
        get status() { return status; },

        time,
        context,
        repository,
        packages,
        commands,
    };

    findLocalPackage(environment);

    return environment;
}