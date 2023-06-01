

export enum BuildMode {
    Development = 'development',
    Test        = 'test',
    Production  = 'production',
}

export interface IContext {
    cwd    : string,
    args   : Array<string>,
    command: string,
    global : boolean,
    ci     : boolean,
    delta  : boolean,
    time   : Date,
    mode   : BuildMode,
}

export default function createContext(location: string): IContext {
    const cwd    : string        = process.cwd();
    const args   : Array<string> = process.argv.slice(3);
    const command: string        = process.argv[2] || '';
    const global : boolean       = cwd === location;
    const ci     : boolean       = pullFlag('-ci', args);
    const delta  : boolean       = pullFlag('-delta', args);
    const time   : Date          = new Date();

    let mode: BuildMode;
    if (ci) {
        mode = BuildMode.Production;
    } else {
        mode = BuildMode.Development;
    }

    return {
        cwd,
        args,
        command,
        global,
        ci,
        delta,
        time,
        mode,
    };
}

function pullFlag(name: string, args: Array<string>): boolean {
    let index = 0;
    let found = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i].trim()
            .toLowerCase();

        if (arg === name) {
            index = i;
            found = true;
            break;
        }
    }

    if (found) args.splice(index, 1);

    return found;
}