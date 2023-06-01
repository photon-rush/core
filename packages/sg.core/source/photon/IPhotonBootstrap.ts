import {OperatingSystem, Platform, Storefront} from '@photon-rush/automation.core/source/constants';
import {PackageTag} from '@photon-rush/automation.core/source/environment/PackageInformation';

export interface IPhotonBootstrap {
    platform: Platform;
    os: OperatingSystem;
    storefront: Storefront,
    banner: string;
    tag: PackageTag;
    frequency: number;
}


export function createDefault(tag: Readonly<PackageTag>, bootstrap?: Partial<IPhotonBootstrap> | null): Readonly<IPhotonBootstrap> {


    return Object.freeze({
        platform  : Platform.BROWSER,
        os        : OperatingSystem.ANY,
        storefront: Storefront.NONE,
        banner    : '',
        frequency : 1000,
        tag,
        ...(bootstrap || {}),
    });


}