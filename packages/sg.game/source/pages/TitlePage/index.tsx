import '@photon-rush/sg.game/source/pages/TitlePage/index.scss';

import {useEngine} from '@photon-rush/sg.core/source/photon';
import Controller, {Page} from '@photon-rush/sg.game/source/Controller';

import React, {useEffect, useState} from 'react';

const TRANSIT   = true; //Use for testing so that we don't force redirect
const fadeDelay = 2; // should match the $fade-delay value in index.scss

export const TitlePage = () => {
    const engine = useEngine();

    const [publisherLogo, setPublisherLogo] = useState('publisherLogo');
    const [transit, setTransit]             = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const publisherLogo = await engine.asset.getText('@photon-rush/sg.assets/content/logo.svg');

            setPublisherLogo(publisherLogo);
        };

        fetchData();
    }, []);

    if (transit && TRANSIT) {
        engine.objects.get<Controller>('controller').frame = true;
        engine.objects.get<Controller>('controller')
              .transition(Page.LANDING, (fadeDelay * 7) * 1000);

        setTransit(false);
    }

    return <div className={'title-page'}>
        <div className="photon-logo" dangerouslySetInnerHTML={{ __html: publisherLogo }}></div>

        {/*<p>----&lt;&lt; presents &gt;&gt;----</p>*/}
        <p>◇ presents ◇</p>

        <h1>Solar Genesis</h1>
    </div>;
};