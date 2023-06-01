import { resolve } from 'path';
import { Configuration } from 'webpack';
import { existsSync } from 'fs-extra';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';

export default function configureContent(packageInformation: IPackage): Configuration {
    const hasContent = existsSync(packageInformation.paths.content);

    if (hasContent) {
        const from = packageInformation.paths.content;
        const to   = resolve(packageInformation.paths.output, './content');

        return {
            plugins: [
                new CopyWebpackPlugin({
                    patterns: [
                        { from, to },
                    ],
                }),
            ],
        };
    }


    return {};
}