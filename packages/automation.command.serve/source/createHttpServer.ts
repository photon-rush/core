import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import { createServer } from 'http';

export default async function createHttpServer(environment: IEnvironment, application: any, port: number = 8080) {
    return new Promise<void>(resolve => {
        createServer(application).listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);

            resolve();
        });
    });
}