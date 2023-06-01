import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';

export function shouldSkip(packageInformation: IPackage, delta: boolean) {
    let skip   = false;
    let reason = '';

    if (packageInformation.meta.config.skip) {
        skip   = true;
        reason = 'Skipped due to config.skip being true.';
    }

    if (packageInformation.meta.name.startsWith('@photon-rush/automation.')) {
        skip   = true;
        reason = 'Skipped, automation packages are not built.';
    }

    if (!packageInformation.changed && delta) {
        skip   = true;
        reason = 'Skipped, this package was not changed';
    }

    return {
        skip,
        reason,
    };
}