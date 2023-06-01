import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import Status from '@photon-rush/general/lib/Status';


export interface ICommand {
    name   : string,
    package: IPackage,
    run    : (environment: IEnvironment) => Promise<void>,
}

export default function createCommand(packageInformation: IPackage): ICommand {
    const name = packageInformation.meta.shortName.replace('automation.command.', '');

    const run = async(environment: IEnvironment) => {
        const command = (await import(packageInformation.meta.name)).default;

        if (typeof command === 'function') {
            await command(environment);
        } else {
            environment.status.add(Status.error({
                message : `Command module must export a default function. Found '${command}' instead`,
                source  : 'run',
                location: name,
            }));
        }
    };

    return {
        name,
        package: packageInformation,
        run,
    };

}