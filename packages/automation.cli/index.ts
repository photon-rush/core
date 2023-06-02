#!/usr/bin/env ts-node-script
import createEnvironment from '@photon-rush/automation.environment/lib/createEnvironment';
import runCommand from '@photon-rush/automation.cli/lib/runCommand';
import showBanner from '@photon-rush/automation.cli/lib/showBanner';
import Status, { StatusType } from '@photon-rush/general/lib/Status';

(async function main() {
    const environment = await createEnvironment();

    console.log(showBanner(environment));
    console.log();

    if (environment.status.type === StatusType.Error) {
        environment.status.add(Status.error('Could not run command, the environment has errors in it. Fix these first.'));
    } else {
        await runCommand(environment.context.command, environment);
    }

    console.log();

    if (environment.status.type === StatusType.Error) {
        if (process.exitCode === 0) process.exitCode = 1;

        environment.status.add(Status.error(`Command ${environment.context.command} failed with ${environment.status.length} messages.`));
    } else if (environment.status.type === StatusType.Warning) {
        environment.status.add(Status.warn(`Command ${environment.context.command} completed with warnings ${environment.status.length} messages.`));
    } else if (environment.status.type === StatusType.Success) {
        environment.status.add(Status.success(`Command ${environment.context.command} completed with ${environment.status.length} messages.`));
    }

    console.log(environment.status.toString(true));
})();