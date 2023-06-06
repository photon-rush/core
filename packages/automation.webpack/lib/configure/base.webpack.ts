import { Configuration, DefinePlugin } from 'webpack';
import VirtualModulesPlugin from 'webpack-virtual-modules';

import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';
import { ITag } from '@photon-rush/globalTypes';

export default function configureBase(packageInformation: IPackage): Configuration {
    return {
        output: {
            path               : packageInformation.paths.output,
            filename           : '[name].js',
            assetModuleFilename: 'content/[name][ext]',
        },
        entry : packageInformation.meta.config.entries,
        module: {
            rules: [
                {
                    test   : /\.tsx?$/,
                    exclude: /node_modules/,
                    use    : [
                        {
                            loader : 'ts-loader',
                            options: {
                                compilerOptions: {
                                    noEmit: false,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.png/,
                    type: 'asset/resource',
                },
                {
                    test: /\.svg/,
                    type: 'asset/resource',
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        performance: {
            hints: false,
        },
        plugins: [
            new VirtualModulesPlugin({
                'node_modules/@photon-rush/tag.js': createTagModule(packageInformation.tag), // Makes the application tag available via `import tag from '@photon-rush/tag'`
            }),
            new DefinePlugin({
                '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })', // silences the react console nonsense.
            }),
        ],
    };
}

function createTagModule(tag: ITag): string {
    return `
export default Object.freeze({
    name: '${tag.name}',
    hash: '${tag.hash}',
    branch: '${tag.branch}',
    date: '${tag.date}',
    mode: '${tag.mode}',
});`.trim();
}