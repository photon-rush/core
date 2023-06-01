import { ESLint } from 'eslint';
import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import Status, { StatusType } from '@photon-rush/general/lib/Status';

interface Summary {
    errors  : number,
    warnings: number,
    files   : number,
}

export default async function lintTypescript(environment: IEnvironment) {
    const fix = !environment.context.ci;

    const include = [
        `${environment.repository.paths.packages}/**/*.ts`,
        `${environment.repository.paths.packages}/**/*.tsx`,
        `${environment.repository.paths.packages}/**/*.js`,
        `${environment.repository.paths.packages}/**/*.jsx`,
    ];

    const eslint = new ESLint({
        fix,
        errorOnUnmatchedPattern: false,
    });

    const results = await eslint.lintFiles(include);

    const summary: Summary = {
        errors  : 0,
        warnings: 0,
        files   : 0,
    };

    results.forEach(r => {
        summary.files++;

        if (fix) {
            summary.errors   += (r.errorCount - r.fixableErrorCount);
            summary.warnings += (r.warningCount - r.fixableWarningCount);
        } else {
            summary.errors   += r.errorCount;
            summary.warnings += r.warningCount;
        }
    });

    let type = StatusType.Success;

    if (summary.errors > 0) {
        type = StatusType.Error;
    } else if (summary.warnings > 0) {
        type = StatusType.Warning;
    }

    environment.status.add(new Status({
        type,
        message : `Found ${summary.errors} errors and ${summary.warnings} warnings in ${summary.files} files.`,
        source  : 'lint:typescript',
        location: environment.context.cwd,
    }));

    if (fix) {
        await ESLint.outputFixes(results);
    }

    const formatter  = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);

    console.log(resultText);
}