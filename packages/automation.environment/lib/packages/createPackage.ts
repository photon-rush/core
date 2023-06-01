import { resolve } from 'path';

import createTag, { ITag } from '@photon-rush/automation.environment/lib/packages/createTag';
import validatePackage from '@photon-rush/automation.environment/lib/packages/validatePackage';
import { ICommonPaths } from '@photon-rush/automation.environment/lib/paths';
import createPackageMeta, { IPackageMeta } from '@photon-rush/automation.environment/lib/packages/createPackageMeta';
import { IRepository } from '@photon-rush/automation.environment/lib/repository/createRepository';
import { IContext } from '@photon-rush/automation.environment/lib/createContext';
import { resolvePaths } from '@photon-rush/automation.environment/lib/resolvePaths';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';

export interface IPackagePaths extends ICommonPaths {
    readme       : string,
    source       : string,
    lib          : string,
    content      : string,
    notes        : string,
    documentation: string,
}

export interface IPackage {
    location: string,
    changed : boolean,
    paths   : IPackagePaths,
    meta    : IPackageMeta,
    valid   : boolean,
    tag     : ITag,
}

interface IState {
    status    : StatusCollection,
    repository: IRepository,
    context   : IContext,
}

export default async function createPackage(location: string, state: IState): Promise<IPackage> {
    const { status, repository, context } = state;

    const changed = repository.changes.packages.has(location);
    const paths   = createPaths(location);
    const meta    = await createPackageMeta(paths.meta, status);
    let valid     = true;

    if (meta.missing) {
        valid = false;
    } else {
        if (meta.config.node && meta.config.entries.length === 0) {
            meta.config.entries.push('./index.ts');
        }

        if (meta.config.web && meta.config.templates.length === 0) {
            meta.config.templates.push('./template.html');
        }

        meta.config.entries   = resolvePaths(location, meta.config.entries);
        meta.config.templates = resolvePaths(location, meta.config.templates);
    }

    const tag = createTag(meta.name, repository, context);

    const packageInformation: IPackage = {
        valid,
        location,
        changed,
        paths,
        meta,
        tag,
    };

    validatePackage(packageInformation, status);

    return packageInformation;
}

function createPaths(location: string): IPackagePaths {
    const temp    = resolve(location, '-temp');
    const logs    = resolve(location, '-logs');
    const output  = resolve(location, '-output');
    const staging = resolve(location, '-staging');

    const meta   = resolve(location, 'package.json');
    const readme = resolve(location, 'readme.md');

    const source        = resolve(location, 'source');
    const lib           = resolve(location, 'lib');
    const content       = resolve(location, 'content');
    const tests         = resolve(location, 'tests');
    const documentation = resolve(location, 'documentation');
    const notes         = resolve(location, 'notes');

    return {
        readme,
        source,
        lib,
        content,
        notes,
        temp,
        logs,
        output,
        staging,
        documentation,
        meta,
        tests,
    };
}