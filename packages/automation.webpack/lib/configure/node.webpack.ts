import { Configuration } from 'webpack';

import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';

export default function configureNode(packageInformation: IPackage): Configuration {
    if (!packageInformation.meta.config.node) return {};

    return {
        target          : 'node',
        externalsPresets: {
            node: true,
        },
    };
}