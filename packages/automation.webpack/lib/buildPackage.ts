import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import BuildResult from '@photon-rush/automation.webpack/lib/BuildResult';
import collectStatus from '@photon-rush/automation.webpack/lib/collectStatus';
import configure from '@photon-rush/automation.webpack/lib/configure';
import Status from '@photon-rush/general/lib/Status';
import { Compiler, webpack } from 'webpack';

const watchOptions = {
    aggregateTimeout: 600,
};

export default async function buildPackage(result: BuildResult, environment: IEnvironment, watch: boolean = false) {
    result.started = new Date();

    if (result.shouldSkip) {
        result.completed = new Date(result.started);
        return;
    }

    const configuration = configure(result.package, environment);

    const compiler = webpack(configuration);

    const action = watch ? webpackWatch : webpackCompile;

    await action(compiler, result);
}

async function webpackCompile(compiler: Compiler, result: BuildResult) {
    return new Promise<void>((resolve) => {
        compiler.run((error, stats) => {
            collectStatus(result, error, stats);

            compiler.close((closeError) => {
                if (closeError) {
                    result.status.add(Status.error('Failed to compile (webpack close error).'));
                }

                resolve();
            });
        });
    });
}

async function webpackWatch(compiler: Compiler, result: BuildResult) {
    return new Promise<void>(() => {
        compiler.watch(watchOptions, (error, stats) => {
            collectStatus(result, error, stats);
        });
    });
}