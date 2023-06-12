import { ITag } from '@photon-rush/globalTypes';
import { OperatingSystem, Platform, Storefront } from '@photon-rush/general/lib/platform';

export interface IPhotonBootstrap {
    platform  : Platform,
    os        : OperatingSystem,
    storefront: Storefront,
    banner    : string,
    tag       : ITag,
    frequency : number,
    seed      : BigUint64Array,
}


export function createDefault(tag: Readonly<ITag>, bootstrap?: Partial<IPhotonBootstrap> | null): Readonly<IPhotonBootstrap> {
    return Object.freeze({
        platform  : Platform.Browser,
        os        : OperatingSystem.Any,
        storefront: Storefront.None,
        banner    : '',
        frequency : 1000,
        seed      : new BigUint64Array([0x49n, 0x4En, 0x49n, 0x54n]),
        tag,
        ...(bootstrap || {}),
    });
}