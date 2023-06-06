import { Configuration } from 'webpack';
import merge from 'webpack-merge';

import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import configureBase from '@photon-rush/automation.webpack/lib/configure/base.webpack';
import configureMode from '@photon-rush/automation.webpack/lib/configure/mode.webpack';
import configureContent from '@photon-rush/automation.webpack/lib/configure/content.webpack';
import configureWeb from '@photon-rush/automation.webpack/lib/configure/web.webpack';
import configureNode from '@photon-rush/automation.webpack/lib/configure/node.webpack';

export default function configure(packageInformation: IPackage, environment: IEnvironment): Configuration {
    const configuration: Array<Configuration> = [
        configureBase,
        configureMode,
        configureContent,
        configureWeb,
        configureNode,
    ].map(fn => fn(packageInformation, environment));

    return merge(configuration);
}