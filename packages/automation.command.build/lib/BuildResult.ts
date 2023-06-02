import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import Status, { StatusType } from '@photon-rush/general/lib/Status';

export default class BuildResult {
    message: string;
    package: IPackage;
    skip   : boolean;
    failed : boolean;
    warning: boolean;

    started  : Date | null;
    completed: Date | null;

    constructor(packageInformation: IPackage, message = '', skip = false,) {
        this.message = message;
        this.package = packageInformation;
        this.skip    = skip;
        this.failed  = false;
        this.warning = false;

        this.started   = null;
        this.completed = null;
    }

    toString() {
        return `${this.package.meta.name} ${this.message}`;
    }

    toStatus(): Status {
        let type       = StatusType.Success;
        const message  = this.message;
        const source   = 'build';
        const location = this.package.meta.name;

        if (this.warning) type = StatusType.Warning;
        if (this.failed) type = StatusType.Error;

        return new Status({
            type,
            message,
            source,
            location,
        });
    }
}