import { exec } from 'child_process';

export default async function getBranch(): Promise<string> {
    const command = 'git branch --show-current';

    return new Promise<string>((pResolve) => {
        exec(command, (error, stdout) => {
            if (error) pResolve('Unknown!');

            const result = stdout.trim();

            pResolve(result);
        });
    });
}