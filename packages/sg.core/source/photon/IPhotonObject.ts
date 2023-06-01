export interface ISimplePhotonObject {
    readonly type: string,
}

export interface IPhotonObject<T = unknown> {
    simplify(): T,
    save(): ISimplePhotonObject & T,
    copy(): IPhotonObject<T>,
    equals(o?: T | null): boolean,
    update?: (current: number, previous: number) => void,
}

export interface IPhotonObjectPrototype<T> {
    new(value?: T): IPhotonObject<T>,

    get type(): string,
}