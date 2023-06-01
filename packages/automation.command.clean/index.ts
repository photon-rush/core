import rimraf from 'rimraf';
import { resolve } from 'path';

import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import getTemporaryDirectories from '@photon-rush/automation.command.clean/lib/getTemporaryDirectories';
import Status from '@photon-rush/general/lib/Status';

const source = 'clean';

export default async function main(environment: IEnvironment) {
    console.log('Command: clean');

    const toDelete: Array<string> = [];

    if (environment.context.global) {
        toDelete.push(...getTemporaryDirectories(environment.repository.paths));

        environment.packages.list.forEach(p => toDelete.push(...getTemporaryDirectories(p.paths)));

        environment.packages.list.forEach(p => toDelete.push(resolve(p.location, '-npm-logs')));
    } else {
        toDelete.push(...getTemporaryDirectories(environment.local?.paths));
    }

    if (toDelete.length === 0) {
        environment.status.add(Status.error({
            source,
            message: 'No files to delete',
        }));
    } else {
        const success = await rimraf(toDelete);

        if (!success) {
            environment.status.add(Status.error({
                source,
                message: 'Could not delete one ore more files.',
            }));
        }
    }
}