import {
    IPhotonObject,
    IPhotonObjectPrototype,
    ISimplePhotonObject,
} from '@photon-rush/sg.core/source/photon/IPhotonObject';
import { deserialize, serialize } from '@photon-rush/sg.core/source/util/serialization';

interface IObjectEntry {
    handle  : string,
    sgObject: IPhotonObject,
    global  : boolean,
}

export default class ObjectManager {
    readonly #constructors : Map<string, IPhotonObjectPrototype<unknown>>;
    readonly #objects      : Map<string, IObjectEntry>;
    readonly #globalObjects: Map<string, IObjectEntry>;
    #currentHandle         : number;

    constructor() {
        this.#constructors  = new Map();
        this.#objects       = new Map();
        this.#globalObjects = new Map();
        this.#currentHandle = 0;
    }

    getTypes() {
        return Array.from(this.#constructors.values());
    }

    addConstructor(prototype: IPhotonObjectPrototype<any>) {
        this.#constructors.set(prototype.type, prototype);
    }

    get<T>(handle: string): T {
        if (this.#objects.has(handle)) return this.#objects.get(handle)!.sgObject as T;

        if (!this.#globalObjects.get(handle)) throw new Error(`Cannot find object ${handle}`);

        return this.#globalObjects.get(handle)!.sgObject as T;
    }

    has(handle: string) {
        return this.#objects.has(handle) || this.#globalObjects.has(handle);
    }

    hasConstructor(type: string) {
        return this.#constructors.has(type);
    }


    #set(entry: IObjectEntry) {
        const map = entry.global ? this.#globalObjects : this.#objects;

        map.set(entry.handle, entry);
    }

    add<T>(simpleObject: (ISimplePhotonObject & T) | string, globalHandle?: string): string {
        const type = typeof simpleObject === 'string' ? simpleObject : simpleObject.type;

        const Constructor = this.#constructors.get(type);
        const handle      = globalHandle || this.#nextHandle();

        if (!Constructor) throw new Error(`Unknown type: ${type}`);
        if (this.has(handle)) throw new Error(`Duplicate handle: ${handle}`);

        this.#set({
            handle,
            global  : !!globalHandle,
            sgObject: new Constructor(simpleObject),
        });

        return handle;
    }

    remove(handle: string): boolean {
        return this.#objects.delete(handle) || this.#globalObjects.delete(handle);
    }

    save() {
        const result: Record<string, ISimplePhotonObject> = {};

        for (const [key, value] of Object.entries(this.#globalObjects)) {
            result[key] = value.sgObject.save();
        }

        return serialize(result);
    }

    load(json: string) {
        const result = deserialize(json);

        for (const [key, value] of Object.entries(result)) {
            this.add(value, key);
        }
    }

    update(current: number, previous: number) {
        for (const value of this.#objects.values()) {
            if (value.sgObject.update) value.sgObject.update(current, previous);
        }

        for (const value of this.#globalObjects.values()) {
            if (value.sgObject.update) value.sgObject.update(current, previous);
        }
    }

    #nextHandle() {
        return `__handle[${this.#currentHandle++}/${Date.now()}]__`;
    }
}