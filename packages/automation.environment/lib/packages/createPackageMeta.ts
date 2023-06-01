import Status from '@photon-rush/general/lib/Status';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';
import { readFile } from 'fs-extra';

export interface IPackageConfiguration {
    skip     : boolean,
    web      : boolean,
    node     : boolean,
    templates: Array<string>,
    entries  : Array<string>,
}

export interface IPackageMeta {
    missing    : boolean,
    name       : string,
    shortName  : string,
    description: string,
    keywords   : Array<string>,
    license    : string,
    version    : string,
    private    : boolean,
    config     : IPackageConfiguration,
    raw        : any,
    repository: {
        type     : string,
        url      : string,
        directory: string,
    },
}

export default async function createPackageMeta(fileLocation: string, status: StatusCollection): Promise<IPackageMeta> {
    let raw;
    let missing = true;

    try {
        const json = await readFile(fileLocation, 'utf-8');
        raw        = JSON.parse(json);
        missing    = false;
    } catch (error) {
        const message  = error instanceof Error ? error.message : error?.toString() || 'undefined';
        const source   = 'createPackageMeta';
        const location = fileLocation;

        status.add(Status.error({ message, source, location }));

        raw = {};
    }

    const name        = coerceString(raw.name);
    const description = coerceString(raw.description);
    const keywords    = coerceArray(raw.keywords);
    const license     = coerceString(raw.license);
    const version     = coerceString(raw.version);
    const _private    = coerceBoolean(raw.private);

    const shortName = name.replace('@photon-rush/', '');

    const repository = raw.repository ? {
        type     : raw.repository.type,
        url      : raw.repository.url,
        directory: raw.repository.directory,
    } : {
        type     : '',
        url      : '',
        directory: '',
    };

    const config = raw.config ? {
        skip     : coerceBoolean(raw.config.skip),
        web      : coerceBoolean(raw.config.web),
        node     : coerceBoolean(raw.config.node),
        templates: coerceArray(raw.config.template),
        entries  : coerceArray(raw.config.entries),
    } : {
        skip     : false,
        web      : false,
        node     : false,
        templates: [],
        entries  : [],
    };

    return {
        missing,
        name,
        shortName,
        description,
        keywords,
        license,
        version,
        private: _private,
        repository,
        config,
        raw,
    };
}

function coerceString(value: any): string {
    if (!value || typeof value !== 'string') return '';

    return value;
}

function coerceArray(value: any): Array<string> {
    if (!value || !Array.isArray(value)) return [];

    const result: Array<string> = [];

    for (let j = 0; j < value.length; j++) {
        if (coerceString(value[j])) {
            result.push(value[j]);
        }
    }

    return result;
}

function coerceBoolean(value: any): boolean {
    if (!value || typeof value !== 'boolean') return false;

    return true;
}