import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import Status from '@photon-rush/general/lib/Status';
import { spawn } from 'child_process';
import { resolve } from 'path';

const extension = process.platform === 'win32' ? '.cmd' : '';

export default async function checkTypescript(environment: IEnvironment) {
    const tsc = resolve(environment.repository.location, `./node_modules/.bin/tsc${extension}`);

    return new Promise<void>((resolve) => {
        const process = spawn(tsc, [], {
            stdio: 'inherit',
        });

        process.on('exit', (code) => {
            if (code !== 0) {
                environment.status.add(Status.error({
                    message : `Typescript failed to compile. Exited with code ${code}.`,
                    source  : 'lint:tsc',
                    location: environment.context.cwd,
                }));
            }

            resolve();
        });
    });


}