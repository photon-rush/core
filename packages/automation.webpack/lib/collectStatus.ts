import { Stats } from 'webpack';

import Status, { StatusType } from '@photon-rush/general/lib/Status';
import BuildResult from '@photon-rush/automation.webpack/lib/BuildResult';
import { formateDateTime } from '@photon-rush/general/lib/formatDate';

const width = 80;

export default function collectStatus(result: BuildResult, error?: Error | null, stats?: Stats, source?: string)  {
    if (error) {
        result.status.add(Status.error(`An error occurred: ${error.message}`, source));
        return;
    }

    if (!stats) {
        result.status.add(Status.error('A stats object was not produced for this compilation', source));
        return;
    }

    result.status.addFrom(stats.compilation.errors.map(error => {
        const location = error.file;
        const message  = error.message;

        return {
            type: StatusType.Error,
            source,
            location,
            message,
        };
    }));

    result.status.addFrom(stats.compilation.warnings.map(error => {
        const location = error.file;
        const message  = error.message;

        return {
            type: StatusType.Warning,
            source,
            location,
            message,
        };
    }));

    printResults(result.package.meta.name, stats);
}

function printResults(name: string, stats: Stats)  {
    const title   = ` ${name}`;
    const time    = formateDateTime(new Date()) + ' ';
    const padding = ' '.repeat(width - (title.length + time.length));

    console.log();
    console.log('-'.repeat(width));
    console.log(`${title}${padding}${time}`);
    console.log('-'.repeat(width));
    console.log();

    const results = stats.toString({
        chunks: false,
        colors: true,
    });

    console.log(results);
}