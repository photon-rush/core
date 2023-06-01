import { BuildMode, OperatingSystem, Platform, Storefront } from '@photon-rush/automation.core/source/constants';
import { IPhotonObject, ISimplePhotonObject } from '@photon-rush/sg.core/source/photon/IPhotonObject';

export interface IFlags {
    firstRun: boolean,
    noIntro : boolean,

    os      : OperatingSystem,
    platform: Platform,
    store   : Storefront,
    mode    : BuildMode,

    features: Record<string, string>,
}

export default class Flags implements IPhotonObject<IFlags>, IFlags {
    readonly #firstRun: boolean;
    readonly #noIntro : boolean;

    readonly #os      : OperatingSystem;
    readonly #platform: Platform;
    readonly #store   : Storefront;
    readonly #mode    : BuildMode;

    readonly #features: Readonly<Record<string, string>>;

    constructor(flags?: IFlags) {
        if (flags) {
            this.#firstRun = flags.firstRun;
            this.#noIntro  = flags.noIntro;
            this.#os       = flags.os;
            this.#platform = flags.platform;
            this.#store    = flags.store;
            this.#mode     = flags.mode;
            this.#features = flags.features; //TODO: needs to be copied
        } else {
            this.#firstRun = true;
            this.#noIntro  = false;
            this.#os       = OperatingSystem.ANY;
            this.#platform = Platform.BROWSER;
            this.#store    = Storefront.NONE;
            this.#mode     = BuildMode.PRODUCTION;
            this.#features = {};
        }

        Object.freeze(this.#features);
    }

    get firstRun() {return this.#firstRun;}

    get noIntro() {return this.#noIntro;}

    get os() {return this.#os;}

    get platform() {return this.#platform;}

    get store() {return this.#store;}

    get mode() {return this.#mode;}

    get features() {return this.#features;}

    simplify(): IFlags {
        return {
            firstRun: this.firstRun,
            noIntro : this.noIntro,
            os      : this.os,
            platform: this.platform,
            store   : this.store,
            mode    : this.mode,
            features: this.features,
        };
    }

    save(): ISimplePhotonObject & IFlags {
        return {
            type: Flags.type,
            ...this.simplify(),
        };
    }

    copy(): Flags {
        return new Flags(this);
    }

    equals(): boolean {
        return false;
    }

    static get type() { return 'flags';}


}