const fetchError = (location: string) => `Failed to fetch requested data from ${location}.`;
const loadError  = (location: string) => `Failed to load requested data from ${location}.`;

enum ReadType {
    TEXT,
    DATA,
    BYTES,
}

/**
 * Downloads resources and caches them in memory as a Blob.
 */
export default class AssetManager {
    readonly #cache: Map<string, Blob>;
    readonly #failed: Set<string>;

    constructor() {
        this.#cache  = new Map();
        this.#failed = new Set();
    }

    /**
     * Returns true if this given resource has been loaded and cached
     * @param location The URI for the resource.
     */
    has(location: string): boolean {
        return this.#cache.has(location);
    }

    /**
     * Returns true if a previous, failed, attempt has been made to load this resource
     * @param location
     */
    hasFailed(location: string): boolean {
        return this.#failed.has(location);
    }

    /**
     * Gets the size, in bytes, of a loaded resource. If the resource hasn't been loaded it returns 0.
     * @param location
     */
    getSize(location: string): number {
        return this.#cache.get(location)?.size || 0;
    }

    /**
     * Gets the mime type of a loaded resource. If the resource hasn't been loaded it returns the empty string.
     * @param location
     */
    getType(location: string): string {
        return this.#cache.get(location)?.type || '';
    }


    /**
     * Removes all loaded resources. They will have to be redownloaded if you want them again (the browser may still cache them though)
     */
    clear() {
        this.#cache.clear();
        this.#failed.clear();
    }

    /**
     * Clears the record of all failed attempts to load resources.
     */
    clearFailed() {
        this.#failed.clear();
    }

    /**
     * Puts a blob directly in to the cache. Any data currently stored at the location will be lost.
     *
     * @param location The URI for the resource.
     * @param blob the blob data to store
     */
    loadBlob(location: string, blob: Blob) {
        this.#cache.set(location, blob);
    }

    /**
     * Loads a resource without reading it.
     * @param location The URI for the resource.
     * @param force If true, will fetch the resource even if its cached. Note: If the resource is cached, but has since become unavailable, this method will remove it from the cache.
     */
    async load(location: string, force: boolean = false) {
        await this.#get(location, force);
    }

    /**
     * Loads a resource and returns it as text. If the resource is not already cached, it will attempt to fetch it.
     * @param location The URI for the resource.
     * @param force if true, the resource will be redownloaded even if past attempts have failed or if the resource has already been cached.
     */
    async getText(location: string, force: boolean = false): Promise<string> {
        return await this.#load(location, ReadType.TEXT, force) as string;
    }

    /**
     * Loads a JSON resource and returns it as an object. If the resource is not already cached, it will attempt to fetch it.
     * @param location The URI for the resource.
     * @param force if true, the resource will be redownloaded even if past attempts have failed or if the resource has already been cached.
     */
    async getJson(location: string, force: boolean = false) {
        const text = await this.#load(location, ReadType.TEXT, force) as string;

        return JSON.parse(text);
    }

    /**
     * Loads a resource and returns it as a data URI. If the resource is not already cached, it will attempt to fetch it.
     * @param location The URI for the resource.
     * @param force if true, the resource will be redownloaded even if past attempts have failed or if the resource has already been cached.
     */
    async getData(location: string, force: boolean = false): Promise<string> {
        return await this.#load(location, ReadType.DATA, force) as string;
    }

    /**
     * Loads a resource and returns it as an ArrayBuffer If the resource is not already cached, it will attempt to fetch it.
     * @param location The URI for the resource.
     * @param force if true, the resource will be redownloaded even if past attempts have failed or if the resource has already been cached.
     */
    async getBytes(location: string, force: boolean = false): Promise<ArrayBuffer> {
        return await this.#load(location, ReadType.BYTES, force) as ArrayBuffer;
    }


    async #load(location: string, type: ReadType, force: boolean): Promise<string | ArrayBuffer> {
        const blob = await this.#get(location, force);

        return new Promise<string | ArrayBuffer>((resolve, reject) => {
            if (!blob) {
                reject(fetchError(location));
                return;
            }

            const reader = new FileReader();

            reader.addEventListener('loadend', () => {
                if (reader.result) {
                    resolve(reader.result);
                } else {
                    reject(loadError(location));
                }
            });

            switch (type) {
                case ReadType.BYTES:
                    reader.readAsArrayBuffer(blob);
                    break;
                case ReadType.DATA:
                    reader.readAsDataURL(blob);
                    break;
                case ReadType.TEXT:
                    reader.readAsText(blob);
                    break;
                default:
                    reject('Invalid data type, this should never happen');
                    break;
            }
        });
    }

    async #get(location: string, force: boolean): Promise<Blob | null> {
        if (this.#cache.has(location) && !force) {
            return this.#cache.get(location)!;
        }

        if (this.#failed.has(location) && !force) {
            return null;
        }

        const options: RequestInit = {
            redirect: 'error',
        };

        const response = await fetch(location, options);

        if (response.ok) {
            const blob = await response.blob();

            this.#cache.set(location, blob);
            this.#failed.delete(location);

            return blob;
        } else if (force) {
            this.#cache.delete(location);
            this.#failed.add(location);
        }

        return null;
    }
}