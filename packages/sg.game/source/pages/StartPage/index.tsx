import '@photon-rush/sg.game/source/pages/StartPage/index.scss';

import { useEngine } from '@photon-rush/sg.core/source/photon';
import Typer from '@photon-rush/sg.game/source/components/Typer';
import Controller, { Page } from '@photon-rush/sg.game/source/Controller';

import React from 'react';

const content = `
ISV Enceladus - Wake Up Sequence v11 |>
 
        {color:darkgray}__DEBUG MODE__{reset}
 
◇      Pod: PSS0x30B94D131AF4
◇ Occupant: LTG {glitch}abcdef ghijklom{reset} (PSS0xAF2BC1291951)
◇     Mode: Partial
 
Checking status...
 
    Power Systems ...................... \`[\`{color:lime} OK {reset}]
    Pod Integrity ...................... \`[\`{color:lime} OK {reset}]
    Life Signs ......................... \`[\`{color:lime} OK {reset}]
    Central Nervous System Link......... \`[\`{color:lime} OK {reset}]
    Main Computer Link ................. \`[\`{color:red}FAIL{reset}]
 
__ERROR__: Cannot connect to main computer!
__ERROR__: Standalone mode integrity check failed!
 
Starting virtual interface...        {color:red}FAIL{reset}
 
    {color:red}ERROR{reset}: 0x000001
        0012:47 isv.enceladus.support.hiber.wake
            |- Invalid pointer detected at &pod.occupant.name
 
    {color:red}ERROR{reset}: 0x23AF32
        0061:47 isv.enceladus.support.hiber.wake
            |- Referential integrity check failed: Mismatch between pod id and sleeper id. (This shouldn't happen,
            |- ensure the db has keycheck enabled)
 
Starting backup interface...                                  
    
       
   
 
`.trim();

export const StartPage = () => {
    const engine = useEngine();

    const onComplete = () => {
        engine.objects.get<Controller>('controller').frame = true;
        engine.objects.get<Controller>('controller')
            .navigate(Page.LANDING);
    };

    return <div className={'start-page'}>
        <Typer content={content} speed={1} onComplete={onComplete}></Typer>
    </div>;
};