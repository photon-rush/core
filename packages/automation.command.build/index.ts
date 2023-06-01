
import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import BuildResult from '@photon-rush/automation.command.build/lib/BuildResult';
import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import { shouldSkip } from '@photon-rush/automation.command.build/lib/shouldSkip';

import buildPackage from '@photon-rush/automation.command.build/lib/buildPackage';
import Status from '@photon-rush/general/lib/Status';

export default async function main(environment: IEnvironment) {
    const toBuild: Array<BuildResult> = [];

    const createResult = (packageInformation: IPackage) => {
        const skip = shouldSkip(packageInformation, environment.context.delta);

        return new BuildResult(packageInformation, skip.reason, skip.skip);
    };

    if (environment.context.global) {
        toBuild.push(...environment.packages.list.map(createResult));
    } else {
        if (environment.local) {
            toBuild.push(createResult(environment.local));
        } else {
            environment.status.add(Status.error({
                message : 'Running in global mode, but no local package was found.',
                source  : 'command.build',
                location: environment.context.cwd,
            }));
        }
    }

    for (let j = 0; j < toBuild.length; j++) {
        toBuild[j] = await buildPackage(toBuild[j], environment);
    }
}