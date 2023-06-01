import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import Status from '@photon-rush/general/lib/Status';
import glob from 'glob';
import Mocha from 'mocha';

function getTests(cwd: string): Promise<Array<string>> {
    return new Promise((resolve) => {
        glob('**/*.spec.ts', {
            cwd,
            absolute: true,
            ignore  : 'node_modules/**',

        }, (error, files) => {
            if (files) {
                resolve(files);
            } else {
                resolve([]);
            }
        });

    });
}

export default async function run(environment: IEnvironment) {
    const files = await getTests(environment.context.cwd);

    const mocha = new Mocha();
    files.forEach(f => mocha.addFile(f));

    return new Promise<void>((resolve) => {
        mocha.run((errorCount) => {
            if (errorCount > 0) {
                environment.status.add(Status.error({
                    message : `${errorCount} failed tests.`,
                    source  : 'unit',
                    location: environment.context.cwd,
                }));
            }
        });

        resolve();
    });
}