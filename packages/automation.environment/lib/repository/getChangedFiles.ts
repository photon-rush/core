import { exec } from 'child_process';
import { resolve } from 'path';

export default async function getChangedFiles(location: string): Promise<Array<string> | null> {
    const command = 'git diff --name-only main';

    return new Promise<Array<string> | null>((pResolve) => {
        exec(command, (error, stdout) => {
            if (error) pResolve(null);

            const result = stdout.trim()
                .split('\n')
                .map(p => resolve(location, p))
            ;

            pResolve(result);
        });
    });
}