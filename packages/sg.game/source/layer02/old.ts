export interface ITool {
    name: string;

    cooldown: number; // Time (in seconds) before the tool can be used again
    speed: number;    // Time (in seconds) it takes to use the tool
    cost: number;     // The amount of energy required to activate the tool

    attributes: Array<IStatChange>; // Changes to drone stats when equipped
}

export interface IStatChange {
    name: string;
    change: (value: number) => number;
}

export enum InstructionTarget {
    SELF     = 'self',
    ENEMY    = 'enemy',
    ANY      = 'any',
    LOCATION = 'cell',
    NONE     = 'none',
}

export enum InstructionAction {
    USE    = 'use',
    ATTACK = 'attack',
    MOVE   = 'move',
}

export interface Instruction {
    target: InstructionTarget;
    action: InstructionAction;

}