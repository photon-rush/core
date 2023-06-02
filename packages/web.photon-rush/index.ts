import '@photon-rush/web.photon-rush/source/index.scss';
import '@photon-rush/web.photon-rush/source/ga.js';
import '@photon-rush/web.resources/content/logo.svg';
import bench from '@photon-rush/web.photon-rush/source/bench';
import getLocation from '@photon-rush/web.photon-rush/source/getLocation';

(async function main() {
    const location = getLocation();

    if (location === 'bench.html') {
        await bench();
    }
})();