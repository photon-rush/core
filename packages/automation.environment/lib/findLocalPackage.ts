import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import Status from '@photon-rush/general/lib/Status';


export default function findLocalPackage(environment: IEnvironment) {
    if (environment.context.global) return;

    const localPackage = environment.packages.byLocation.get(environment.context.cwd);

    if (!localPackage) {
        environment.status.add(Status.error({
            message : 'Ran locally, but could not find package at this location.',
            location: environment.context.cwd,
            source  : 'findLocalPackage',
        }));

        return;
    }

    environment.local = localPackage;
}