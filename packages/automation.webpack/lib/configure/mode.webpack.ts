import { Configuration } from 'webpack';

import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';

export default function configureMode(packageInformation: IPackage, environment: IEnvironment): Configuration {
    const mode: 'production' | 'development' = environment.context.ci ? 'production' : 'development';

    const result: Configuration = {
        mode,
    };

    if (mode === 'development') {
        result.devtool = 'source-map';
    }

    return result;
}