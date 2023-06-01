import { ICommonPaths } from '@photon-rush/automation.environment/lib/paths';

export default function getTemporaryDirectories(paths?: ICommonPaths | null): Array<string> {
    if (!paths) return [];

    return [
        paths.logs,
        paths.staging,
        paths.temp,
        paths.output,
    ];
}