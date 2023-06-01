import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';

export default class BuildResult {
    message: string;
    package: IPackage;
    skip   : boolean;
    failed : boolean;

    started  : Date | null;
    completed: Date | null;

    constructor(packageInformation: IPackage, message = '', skip = false,) {
        this.message = message;
        this.package = packageInformation;
        this.skip    = skip;
        this.failed  = false;

        this.started   = null;
        this.completed = null;
    }

    toString() {
        return `${this.package.meta.name} ${this.message}`;
    }
}