import { IContext } from '@photon-rush/automation.environment/lib/createContext';
import { IRepository } from '@photon-rush/automation.environment/lib/repository/createRepository';

export interface ITag {
    name  : string,
    hash  : string,
    branch: string,
    date  : string,
    mode  : string,
}

export default function createTag(name: string, repository: IRepository, context: IContext) : ITag {
    const hash   = repository.hash;
    const branch = repository.branch;
    const date   = new Date().toISOString();
    const mode   = context.mode;

    return {
        name,
        hash,
        branch,
        date,
        mode,
    };
}