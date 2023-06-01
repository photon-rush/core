import sa from '@photon-rush/general/lib/node/sa';
import { app, BrowserWindow } from 'electron';

const gameLocation    = sa('@photon-rush/sg.game/-out/index.html');
const preloadLocation = sa('@photon-rush/sg.host/source/preload.js');
console.log(gameLocation);


async function main() {
    await app.whenReady();
    //app.applicationMenu = null;
    app.name = 'Solar Genesis';

    const window = new BrowserWindow({
        width         : 1366,
        height        : 768,
        webPreferences: {
            preload: preloadLocation,
        },
    });

    await window.loadFile(gameLocation);

    console.log('hello');
}

main();