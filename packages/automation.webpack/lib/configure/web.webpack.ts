import { Configuration } from 'webpack';
import { resolve, basename } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';

export default function configureWeb(packageInformation: IPackage): Configuration {
    if (!packageInformation.meta.config.web) return {};

    const htmlPlugins: Array<HtmlWebpackPlugin> = packageInformation.meta.config.templates
        .map(filename => (new HtmlWebpackPlugin({
            filename  : basename(filename),
            template  : filename,
            publicPath: packageInformation.meta.name,
            base      : '/',
        })))
        ;

    console.log(htmlPlugins);

    return {
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use : [
                        MiniCssExtractPlugin.loader,
                        {
                            loader : 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin(), // Extracts css file in to separate files
            ...htmlPlugins,
        ],
    };
}