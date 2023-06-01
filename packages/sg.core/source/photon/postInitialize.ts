import { BuildMode } from '@photon-rush/automation.environment/lib/createContext';
import { OperatingSystem, Platform, Storefront } from '@photon-rush/general/lib/platform';
import Counter from '@photon-rush/sg.core/source/objects/Counter';
import Flags, { IFlags } from '@photon-rush/sg.core/source/objects/Flags';
import HexPoint from '@photon-rush/sg.core/source/objects/HexPoint';
import Point from '@photon-rush/sg.core/source/objects/Point';
import { PhotonEngine } from '@photon-rush/sg.core/source/photon/index';

export default function postInitialize(engine: PhotonEngine) {
    const defaultFlags: IFlags = {
        firstRun: true,
        noIntro : false,
        os      : OperatingSystem.Any,
        platform: Platform.Browser,
        store   : Storefront.None,
        mode    : BuildMode.Production,
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