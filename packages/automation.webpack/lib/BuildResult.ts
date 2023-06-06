import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import Status from '@photon-rush/general/lib/Status';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';

export default class BuildResult {
    status    : StatusCollection;
    package   : IPackage;
    shouldSkip: boolean;

    started  : Date | null;
    completed: Date | null;

    constructor(packageInformation: IPackage) {
        this.status     = new StatusCollection();
        this.package    = packageInformation;
        this.shouldSkip = false;
        this.started    = null;
        this.completed  = null;
    }

    skip(reason: string) {
        this.shouldSkip = true;
        this.status.add(Status.success(reason));
    }
}