import { exec } from 'child_process';

export default async function getHash(): Promise<string> {
    const command = 'git rev-parse HEAD';

    return new Promise<string>((pResolve) => {
        exec(command, (error, stdout) => {
            if (error) pResolve('Unknown!');

            const result = stdout.trim().toUpperCase();

            pResolve(result);
        });
    });
}