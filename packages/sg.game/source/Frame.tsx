import { useEngine } from '@photon-rush/sg.core/source/photon';
import Controller, { defaultFrame, defaultPage, Page } from '@photon-rush/sg.game/source/Controller';
import { AboutPage } from '@photon-rush/sg.game/source/pages/AboutPage';
import { EmptyPage } from '@photon-rush/sg.game/source/pages/EmptyPage';
import { LandingPage } from '@photon-rush/sg.game/source/pages/LandingPage';
import { SettingsPage } from '@photon-rush/sg.game/source/pages/SettingsPage';
import { StartPage } from '@photon-rush/sg.game/source/pages/StartPage';
import { TitlePage } from '@photon-rush/sg.game/source/pages/TitlePage';
import React, { useState } from 'react';

interface IFrameWindowProps {
    page: Page,
}

const FrameWindow = (props: IFrameWindowProps) => {
    const selectPageComponent = () => {
        switch (props.page) {
        case Page.EMPTY:
            return <EmptyPage/>;
        case Page.TITLE:
            return <TitlePage/>;
        case Page.START:
            return <StartPage/>;
        case Page.ABOUT:
            return <AboutPage/>;
        case Page.SETTINGS:
            return <SettingsPage/>;
        case Page.LANDING:
            return <LandingPage/>;
        default:
            return <h1>No Page configured</h1>;
        }
    };

    return <div className="content spad">{selectPageComponent()}</div>;
};

export const Frame = () => {
    const engine = useEngine();

    const [currentPage, setCurrentPage] = useState<Page>(defaultPage);
    const [showFrame, setShowFrame]     = useState<boolean>(defaultFrame);

    window.addEventListener('pageSwitch', (() => {
        setCurrentPage(engine.objects.get<Controller>('controller')?.page || defaultPage);
        setShowFrame(engine.objects.get<Controller>('controller')?.frame || defaultFrame);
    }));

    const changePage = (next: Page) => {
        console.log(next);

        engine.objects.get<Controller>('controller')
            ?.navigate(next);
    };

    if (showFrame) {
        return <main>
            <div className="container">
                <div className="row">
                    <h2 className="bthin btr spad">Drone Control</h2>
                    <div className="pre spad valign">News: The news is bad for you</div>
                </div>
            </div>
            <div className="container bthin content">
                <div className="row">
                    <div className="menu spad">
                        <ol className="button-list">
                            <li>
                                <button onClick={() => changePage(Page.LANDING)}>Main</button>
                            </li>
                            <li>Wiki</li>
                            <li>Drone Control</li>
                            <li>Drone Garage</li>
                            <li>
                                <button onClick={() => changePage(Page.SETTINGS)}>Settings</button>
                            </li>
                            <li>
                                <button onClick={() => changePage(Page.ABOUT)}>About</button>
                            </li>
                        </ol>
                    </div>
                    <div className="placeholder"></div>
                    <div className="advisor spad bthin">
                        <div className="pre">Advisor: AMC[2]</div>
                        <div className="pre"> Mood: Scratchy</div>
                        <div className="pre">History ∙ Ask ∙ Disable</div>
                    </div>
                </div>

                <FrameWindow page={currentPage}></FrameWindow>
            </div>
        </main>;
    } else {
        return <main><FrameWindow page={currentPage}></FrameWindow></main>;

    }
};