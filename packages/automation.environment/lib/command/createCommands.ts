import createCommand, { ICommand } from '@photon-rush/automation.environment/lib/command/createCommand';
import { IPackage } from '@photon-rush/automation.environment/lib/packages/createPackage';

export interface ICommands {
    list  : Array<ICommand>,
    byName: Map<string, ICommand>,
}

export default function createCommands(packages: Array<IPackage>): ICommands {
    const result: ICommands = {
        list  : [],
        byName: new Map(),
    };

    for (let j = 0; j < packages.length; j++) {
        if (!isCommand(packages[j].meta.name)) continue;

        const command = createCommand(packages[j]);

        result.list.push(command);
        result.byName.set(command.name, command);
    }

    return result;
}


function isCommand(name: string) {
    return name.startsWith('@photon-rush/automation.command');
}