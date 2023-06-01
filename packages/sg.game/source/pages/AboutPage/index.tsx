import '@photon-rush/sg.game/source/pages/AboutPage/index.scss';

import { useEngine } from '@photon-rush/sg.core/source/photon';
import HexGridDisplay from '@photon-rush/sg.game/source/components/HexGridDisplay';
import React, { useEffect, useState } from 'react';

import FormattedText from '@photon-rush/sg.game/source/components/FormattedText';


export const AboutPage = () => {
    const engine = useEngine();

    const [currentTab, setCurrentTab]       = useState('changelog');
    const [publisherLogo, setPublisherLogo] = useState('publisherLogo');
    const [changelog, setChangelog]         = useState('changelog');
    const [exampleNam, setExampleNam]       = useState('exampleNam');

    useEffect(() => {
        const fetchData = async() => {
            const changelog     = await engine.asset.getText('@photon-rush/sg.assets/content/changelog.txt');
            const publisherLogo = await engine.asset.getText('@photon-rush/sg.assets/content/logo.svg');
            const exampleNam    = await engine.asset.getText('@photon-rush/sg.assets/content/kitchen-sink.nam');

            setChangelog(changelog);
            setPublisherLogo(publisherLogo);
            setExampleNam(exampleNam);
        };

        fetchData();
    }, []);

    const getTab = () => {
        if (currentTab === 'changelog') return changelog;
        if (currentTab === 'legal') return 'License';

        return 'Unknown Tab';
    };


    return <>
        <br/>
        <br/>
        {/* <pre className="logo">
            {logo}
        </pre> */}

        <br/>

        {/* <div dangerouslySetInnerHTML={gameLogoHtml}></div> */}
        <div className="photon-logo" dangerouslySetInnerHTML={{ __html: publisherLogo }}></div>


        <br/>

        <HexGridDisplay></HexGridDisplay>

        <br/>
        <p>(c) 2023 Photon-Rush Interactive, Aaron C Willows</p>
        <br/>

        <FormattedText notMarkdownText={exampleNam}></FormattedText>

        <ol className="button-list">
            <li><a href="#">Report Issue</a></li>
            <li><a href="#">Roadmap</a></li>
        </ol>


        <br/>
        <table className="defs">
            <tbody>
                <tr>
                    <th>Branch:</th>
                    <td>main</td>
                </tr>
                <tr>
                    <th>Version:</th>
                    <td>Update 0 (2023-03-12)</td>
                </tr>
                <tr>
                    <th>Platform:</th>
                    <td>Web</td>
                </tr>
                <tr>
                    <th>Client:</th>
                    <td>123456789</td>
                </tr>
            </tbody>
        </table>

        <br/>

        <ol className="button-list">
            <li>
                <button onClick={() => setCurrentTab('changelog')}>Changelog</button>
            </li>
            <li>
                <button onClick={() => setCurrentTab('legal')}>Legal</button>
            </li>
        </ol>

        <br/>
        <pre>{getTab()}</pre>

    </>;
};