import { Configuration } from 'webpack';
import merge from 'webpack-merge';

import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import configureBase from '@photon-rush/automation.webpack/source/base.webpack';
import configureMode from '@photon-rush/automation.webpack/source/mode.webpack';
import configureContent from '@photon-rush/automation.webpack/source/content.webpack';
import configureWeb from '@photon-rush/automation.webpack/source/web.webpack';
import configureNode from '@photon-rush/automation.webpack/source/node.webpack';

export default function configureWebpack(packageInformation: IPackage, environment: IEnvironment): Configuration {
    const configuration: Array<Configuration> = [
        configureBase,
        configureMode,
        configureContent,
        configureWeb,
        configureNode,
    ].map(fn => fn(packageInformation, environment));

    return merge(configuration);
}