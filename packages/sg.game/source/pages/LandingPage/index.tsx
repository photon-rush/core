import '@photon-rush/sg.game/source/pages/LandingPage/index.scss';

import Counter from '@photon-rush/sg.core/source/objects/Counter';
import { useEngine } from '@photon-rush/sg.core/source/photon';
import { formatNumber } from '@photon-rush/general/lib/formatNumber';
import React, { useState } from 'react';

export const LandingPage = () => {
    const engine = useEngine();

    const [currentMagnitude, setCurrentMagnitude] = useState(formatNumber(0));

    window.addEventListener('gameUpdate', (() => {
        const value = engine.objects.get<Counter>('counter')?.value || 0;
        setCurrentMagnitude(formatNumber(value));
    }));

    return <>
        <p>I don't know, just something? {currentMagnitude}</p>
    </>;
};