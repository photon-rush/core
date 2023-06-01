import { ICounter } from '@photon-rush/sg.core/source/objects/Counter';
import { initializeEngine, useEngine } from '@photon-rush/sg.core/source/photon';
import { Application } from '@photon-rush/sg.game/source/Application';
import Controller, { defaultFrame, defaultPage, IController, Page } from '@photon-rush/sg.game/source/Controller';
import tag from '@photon-rush/tag';
import React from 'react';
import { createRoot } from 'react-dom/client';

const banner = `
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────


     █████████           ████
  ███░░░░░███         ░░███
 ░███    ░░░   ██████  ░███   ██████   ████████
 ░░█████████  ███░░███ ░███  ░░░░░███ ░░███░░███
  ░░░░░░░░███░███ ░███ ░███   ███████  ░███ ░░░
  ███    ░███░███ ░███ ░███  ███░░███  ░███
 ░░█████████ ░░██████  █████░░████████ █████
  ░░░░░░░░░   ░░░░░░  ░░░░░  ░░░░░░░░ ░░░░░



                █████████                                        ███
               ███░░░░░███                                      ░░░
              ███     ░░░   ██████  ████████    ██████   █████  ████   █████
             ░███          ███░░███░░███░░███  ███░░███ ███░░  ░░███  ███░░
             ░███    █████░███████  ░███ ░███ ░███████ ░░█████  ░███ ░░█████
             ░░███  ░░███ ░███░░░   ░███ ░███ ░███░░░   ░░░░███ ░███  ░░░░███
              ░░█████████ ░░██████  ████ █████░░██████  ██████  █████ ██████
               ░░░░░░░░░   ░░░░░░  ░░░░ ░░░░░  ░░░░░░  ░░░░░░  ░░░░░ ░░░░░░



                                                                   Copyright 2023 Aaron Willows, Photon-Rush Interactive
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
`.trim();

export default async function bootstrap(document: Document) {
    initializeEngine(tag, {
        banner,
    });

    const engine = useEngine();

    engine.objects.addConstructor(Controller);

    engine.objects.add<ICounter>({
        type     : 'counter',
        value    : 0,
        cap      : Infinity,
        frequency: 2000,
        increment: 5000,
        active   : true,
        bypass   : false,
    }, 'counter');

    engine.objects.add<IController>({
        type : 'controller',
        page : defaultPage,
        frame: defaultFrame,
    }, 'controller');

    await engine.start();

    const host = document.createElement('div');
    host.id    = 'main';
    document.body.append(host);

    const root = createRoot(host);
    root.render(<Application/>);
}