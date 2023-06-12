import AssetManager from '@photon-rush/sg.core/source/photon/AssetManager';
import postInitialize from '@photon-rush/sg.core/source/photon/postInitialize';
import { createDefault, IPhotonBootstrap } from '@photon-rush/sg.core/source/photon/IPhotonBootstrap';
import ObjectManager from '@photon-rush/sg.core/source/photon/ObjectManager';
import IPhotonError from '@photon-rush/sg.core/source/photon/IPhotonError';
import { ITag } from '@photon-rush/globalTypes';
import Random from '@photon-rush/general/lib/Random';

export enum EngineState {
    ERROR       = 'error',
    STARTED     = 'started',
    STOPPED     = 'stopped',
    PAUSED      = 'paused',
    NOT_STARTED = 'unstarted',
}

export interface EngineUpdateEvent {
    engine : PhotonEngine,
    current: number,
}

export class PhotonEngine {
    readonly #frequency    : number;
    readonly #errors       : Array<IPhotonError>;
    readonly #assetManager : AssetManager;
    readonly #objectManager: ObjectManager;
    readonly #configuration: Readonly<IPhotonBootstrap>;
    readonly #random       : Random;

    #state     : EngineState;
    #loopHandle: number | null;
    #fatalError: boolean;

    private constructor(bootstrap: IPhotonBootstrap) {
        this.#configuration = bootstrap;

        this.#frequency  = bootstrap.frequency || 1000;
        this.#state      = EngineState.NOT_STARTED;
        this.#loopHandle = null;
        this.#errors     = [];
        this.#fatalError = false;

        this.#random        = new Random(bootstrap.seed);
        this.#assetManager  = new AssetManager();
        this.#objectManager = new ObjectManager();

        let banner = `${this.#configuration.banner}\n`;

        if (bootstrap.tag) {
            banner = `${banner}${this.#configuration.tag.branch} | ${this.#configuration.tag.date} | ${this.#configuration.tag.hash}`;
        }

        banner = banner.trim();

        if (banner) {
            console.log(banner);
        }
    }

    get configuration() { return this.#configuration; }

    get frequency() { return this.#frequency; }

    get state() { return this.#state; }

    get hasErrors() { return this.#errors.length > 0; }

    get hasFatalErrors() { return this.#fatalError; }

    get asset() { return this.#assetManager; }

    get objects() { return this.#objectManager; }

    get random() { return this.#random; }

    async start() {
        if (this.state === EngineState.ERROR || this.state === EngineState.STARTED) return;
        this.#state = EngineState.STARTED;


        this.loop();
    }

    async stop() {
        if (this.state === EngineState.ERROR || this.state === EngineState.STOPPED) return;

        if (this.#loopHandle) window.clearTimeout(this.#loopHandle);

        this.#state = EngineState.STOPPED;
    }

    async pause() {
        if (this.state === EngineState.ERROR || this.state === EngineState.PAUSED) return;
        this.#state = EngineState.PAUSED;
    }

    private loop() {
        let previous: DOMHighResTimeStamp = window.performance.now();

        this.#loopHandle = window.setInterval(() => {
            if (this.state === 'paused') return;
            const current = window.performance.now();

            this.#objectManager.update(current, previous);

            const event = new CustomEvent<EngineUpdateEvent>('gameUpdate', {
                detail: {
                    current,
                    engine: this,
                },
            });

            dispatchEvent(event);

            previous = current;
        }, this.frequency);
    }


    addError(error: IPhotonError, log: boolean = true) {
        this.#errors.push(error);

        if (error.fatal) {
            this.#fatalError = true;
            this.#state      = EngineState.ERROR;
        }

        if (log) {
            console.log(error.toString());
        }
    }

    * errors() {
        for (let j = 0; j < this.#errors.length; j++) {
            yield this.#errors[j];
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Singleton
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static #instance: PhotonEngine | null = null;

    static getInstance() {
        if (!this.#instance) throw new Error('The photon engine has not been initialized!');

        return this.#instance!;
    }

    static initialize(tag: ITag, bootstrap?: Partial<IPhotonBootstrap>) {
        const configuration = createDefault(tag, bootstrap);

        if (!this.#instance) {
            this.#instance = new PhotonEngine(configuration);
        }

        postInitialize(this.#instance);

        return this.#instance;
    }
}

export function initializeEngine(tag: ITag, bootstrap?: Partial<IPhotonBootstrap>) {
    PhotonEngine.initialize(tag, bootstrap);
}

export function useEngine() {
    return PhotonEngine.getInstance();
}

//TODO: globalThis.λphoton = {useEngine, initializeEngine}