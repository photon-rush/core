

import checkTypescript from '@photon-rush/automation.command.lint/lib/checkTypescript';
import lintTypescript from '@photon-rush/automation.command.lint/lib/lintTypescript';
import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';

const source = 'lint';

export default async function main(environment: IEnvironment) {
    await checkTypescript(environment);

    await lintTypescript(environment);
}