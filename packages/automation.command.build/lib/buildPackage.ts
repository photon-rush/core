import BuildResult from '@photon-rush/automation.command.build/lib/BuildResult';
import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import configureWebpack from '@photon-rush/automation.webpack';
import webpack from 'webpack';

export default async function buildPackage(status: BuildResult, environment: IEnvironment): Promise<BuildResult> {
    status.started = new Date();

    if (status.skip) {
        status.completed = new Date(status.started);

        return status;
    }

    console.log();
    console.log('-'.repeat(80));
    console.log(` ${status.package.meta.name}`);
    console.log('-'.repeat(80));
    console.log();

    const configuration = configureWebpack(status.package, environment);

    return await webpackCompile(configuration, status);
}

async function webpackCompile(configuration: webpack.Configuration, status: BuildResult): Promise<BuildResult> {
    try {
        const compiler = webpack(configuration);

        return new Promise((resolve) => {
            compiler.run((error, stats) => {
                if (error) {
                    console.error(error.message);

                    status.failed  = true;
                    status.message = error.message;
                }

                if (stats) {
                    compilerOutput(stats, status);
                } else {
                    status.failed  = true;
                    status.message = 'Missing webpackFactory stats object.';
                }

                compiler.close((closeError) => {
                    if (closeError) {
                        status.failed  = true;
                        status.message = 'Failed to compile (close error).';
                    }

                    resolve(status);
                });
            });
        });
    } catch (error) {
        console.error(error);

        status.failed  = true;
        status.message = 'Failed to create compiler.';

        return status;
    }
}

function compilerOutput(stats: webpack.Stats, status: BuildResult) {
    const errors   = stats.compilation.errors.length;
    const warnings = stats.compilation.warnings.length;

    const errorMessage   = errors ? `❰${errors} errors❱` : '';
    const warningMessage = errors ? `❰${warnings} warnings❱` : '';
    const message        = `${errorMessage} ${warningMessage}`;

    if (errors > 0) {
        status.message = `Failed to compile. ${message}.`;
        status.failed  = true;
    } else if (warnings > 0) {
        status.message = `Compiled with warnings. ${message}`;
        status.warning = true;
    } else {
        status.message = 'Compiled successfully.';
    }

    stats.toString({});

    console.log(stats.toString({
        chunks: false,
        colors: true,
    }));

    return status;
}