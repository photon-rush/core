import { resolve } from 'path';

import createChangeSet from '@photon-rush/automation.environment/lib/repository/createChangeSet';
import getBranch from '@photon-rush/automation.environment/lib/repository/getBranch';
import getChangedFiles from '@photon-rush/automation.environment/lib/repository/getChangedFiles';
import getHash from '@photon-rush/automation.environment/lib/repository/getHash';
import type { ICommonPaths } from '@photon-rush/automation.environment/lib/paths';

export interface IRepositoryPaths extends ICommonPaths {
    packages: string,
}

export interface IRepositoryChanges {
    global  : boolean,
    files   : Array<string>,
    packages: Set<string>,
}

export interface IRepository {
    location: string,
    branch  : string,
    hash    : string,
    changes : IRepositoryChanges,
    paths   : IRepositoryPaths,
}

export default async function createRepository(location: string): Promise<IRepository> {
    const branch       = await getBranch();
    const hash         = await getHash();
    const changedFiles = await getChangedFiles(location);

    const temp          = resolve(location, '-temp');
    const logs          = resolve(location, '-logs');
    const output        = resolve(location, '-output');
    const staging       = resolve(location, '-staging');
    const documentation = resolve(location, 'documentation');
    const meta          = resolve(location, 'package.json');
    const packages      = resolve(location, 'packages');
    const tests         = resolve(location, 'tests');

    // changedFiles?.push('C:\\repositories\\core\\packages\\automation.environment\\index.ts');

    const changeset = createChangeSet(packages, changedFiles);


    const changes: IRepositoryChanges = {
        ...changeset,
        files: changedFiles || [],
    };

    return {
        location,
        branch,
        hash,
        changes,
        paths: {
            packages,
            temp,
            logs,
            output,
            staging,
            documentation,
            meta,
            tests,
        },
    };
}