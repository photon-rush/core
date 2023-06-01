import { BuildMode, OperatingSystem, Platform, Storefront } from '@photon-rush/automation.core/source/constants';
import Counter from '@photon-rush/sg.core/source/objects/Counter';
import Flags, { IFlags } from '@photon-rush/sg.core/source/objects/Flags';
import HexPoint from '@photon-rush/sg.core/source/objects/HexPoint';
import Point from '@photon-rush/sg.core/source/objects/Point';
import { PhotonEngine } from '@photon-rush/sg.core/source/photon/index';

export default function postInitialize(engine: PhotonEngine) {
    const defaultFlags: IFlags = {
        firstRun: true,
        noIntro : false,
        os      : OperatingSystem.ANY,
        platform: Platform.BROWSER,
        store   : Storefront.NONE,
        mode    : BuildMode.PRODUCTION,
        features: {},
    };

    engine.objects.addConstructor(Counter);
    engine.objects.addConstructor(HexPoint);
    engine.objects.addConstructor(Point);
    engine.objects.addConstructor(Flags);

    engine.objects.add({
        type: 'flags',
        ...defaultFlags,
    }, 'flags');
}