import { existsSync } from 'fs-extra';

import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';
import Status from '@photon-rush/general/lib/Status';

const source = 'validatePackage';

const messageLicense  = (license: string) => `Invalid license type, must be 'GPL-3.0-or-later' but found '${license}.`;
const messageName     = (name: string) => `Package must have a valid name. '${name}' is invalid.`;
const messageScope    = (name: string) =>`Missing or invalid scope, package name must start with '@photon-rush/' but found '${name}'.`;
const messageEntry    = (entry: string) =>  `Cannot find entry point at '${entry}'`;
const messageTemplate = (template: string) =>  `Cannot find template at '${template}'`;

export default async function validatePackage(packageInformation: IPackage, status: StatusCollection) {
    if (!packageInformation.valid) return;

    const addError = (message: string) => {
        packageInformation.valid = false;

        status.add(Status.error({
            location: packageInformation.location,
            message,
            source,
        }));
    };

    if (packageInformation.meta.license !== 'GPL-3.0-or-later') addError(messageLicense(packageInformation.meta.license));
    if (!packageInformation.meta.name) addError(messageName(packageInformation.meta.name));
    if (!packageInformation.meta.name.startsWith('@photon-rush/')) addError(messageScope(packageInformation.meta.name));
    if (!packageInformation.meta.private) addError('Package must be private.');

    for (let j = 0; j < packageInformation.meta.config.entries.length; j++) {
        if (!existsSync(packageInformation.meta.config.entries[j])) {
            addError(messageEntry(packageInformation.meta.config.entries[j]));
        }
    }

    for (let j = 0; j < packageInformation.meta.config.templates.length; j++) {
        if (!existsSync(packageInformation.meta.config.templates[j])) {
            addError(messageTemplate(packageInformation.meta.config.templates[j]));
        }
    }
}