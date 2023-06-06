
import { skip } from '@photon-rush/automation.command.build';
import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import BuildResult from '@photon-rush/automation.webpack/lib/BuildResult';
import buildPackage from '@photon-rush/automation.webpack/lib/buildPackage';
import Status from '@photon-rush/general/lib/Status';

export default async function main(environment: IEnvironment) {
    if (environment.context.global) {
        environment.status.add(Status.error({
            message : 'Cannot run watch in global mode.',
            source  : 'command.watch',
            location: environment.context.cwd,
        }));
    } else {
        if (environment.local) {
            const result = new BuildResult(environment.local);

            skip(result, environment.context.delta);

            await buildPackage(result, environment, true);

        } else {
            environment.status.add(Status.error({
                message : 'Running in global mode, but no local package was found.',
                source  : 'command.watch',
                location: environment.context.cwd,
            }));
        }
    }

}