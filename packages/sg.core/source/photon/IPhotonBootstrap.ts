import { ITag } from '@photon-rush/globalTypes';
import { OperatingSystem, Platform, Storefront } from '@photon-rush/general/lib/platform';

export interface IPhotonBootstrap {
    platform  : Platform,
    os        : OperatingSystem,
    storefront: Storefront,
    banner    : string,
    tag       : ITag,
    frequency : number,
}


export function createDefault(tag: Readonly<ITag>, bootstrap?: Partial<IPhotonBootstrap> | null): Readonly<IPhotonBootstrap> {
    return Object.freeze({
        platform  : Platform.Browser,
        os        : OperatingSystem.Any,
        storefront: Storefront.None,
        banner    : '',
        frequency : 1000,
        tag,
        ...(bootstrap || {}),
    });
}