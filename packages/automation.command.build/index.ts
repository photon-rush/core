import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';

import Status from '@photon-rush/general/lib/Status';
import BuildResult from '@photon-rush/automation.webpack/lib/BuildResult';
import buildPackage from '@photon-rush/automation.webpack/lib/buildPackage';

export default async function main(environment: IEnvironment) {
    const toBuild: Array<BuildResult> = [];

    const createResult = (packageInformation: IPackage) => {
        const result = new BuildResult(packageInformation);

        skip(result, environment.context.delta);

        return result;
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
        await buildPackage(toBuild[j], environment);

        environment.status.addFrom(toBuild[j].status);
    }
}

export function skip(result: BuildResult, delta: boolean) {
    if (result.package.meta.config.skip) {
        result.skip('Skipped due to config.skip being true.');
    } else if (result.package.meta.name.startsWith('@photon-rush/automation.')) {
        result.skip('Skipped, automation packages are not built.');
    } else if (!result.package.changed && delta) {
        result.skip('Skipped, this package was not changed');
    }
}