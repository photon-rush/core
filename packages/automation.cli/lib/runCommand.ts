import { ICommand } from '@photon-rush/automation.environment/lib/command/createCommand';
import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';
import Status from '@photon-rush/general/lib/Status';

interface ITuple {
    name    : string,
    command?: ICommand,
}

export default async function runCommand(name: string | Array<string>, environment: IEnvironment) {
    const tuples = (typeof name === 'string' ? [name] : name)
        .map(name => ({ name, command: environment.commands.byName.get(name) }))
    ;

    for (let j = 0; j < tuples.length; j++) {
        await run(tuples[j], environment);
    }
}

async function run(tuple: ITuple, environment: IEnvironment) {
    if (tuple.command)  {
        await tuple.command.run(environment);
    } else {
        environment.status.add(Status.error({
            message: `Could not find command ${tuple.name}`,
            source : 'runCommand',
        }));
    }
}