import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import { formateDateTime } from '@photon-rush/general/lib/formatDate';

const width = 80;

export default function showBanner(environment: IEnvironment) {
    const border   = '-'.repeat(width);
    const headline = createHeadline(environment);
    const subline  = createSubline(environment);

    return [
        border,
        headline,
        subline,
        border,
    ].join('\n');
}

function createHeadline(environment: IEnvironment): string {
    const title   = ' Photon-Rush Interactive CLI';
    const time    = formateDateTime(environment.time) + ' ';
    const padding = ' '.repeat(width - (title.length + time.length));

    return `${title}${padding}${time}`;
}

function createSubline(environment: IEnvironment): string {
    const prefix = `  ${environment.repository.branch} ◇ ${environment.context.command}`;

    const ci    = environment.context.ci ? '[CI] ' : '';
    const local = environment.context.global ? '[GLOBAL] ' : '[LOCAL] ';
    const delta = environment.context.delta ? '[DELTA] ' : '';
    const flags = `${ci}${local}${delta}`;

    const padding = ' '.repeat(width - (prefix.length + flags.length));

    return `${prefix}${padding}${flags}`;
}