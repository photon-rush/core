import { Configuration } from 'webpack';

import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';

export default function configureBase(packageInformation: IPackage): Configuration {
    console.log(packageInformation.meta.config.entries);
    process.exit();

    return {
        output: {
            path               : packageInformation.paths.output,
            filename           : '[name].js',
            assetModuleFilename: 'content/[name][ext]',
        },
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
    };
}