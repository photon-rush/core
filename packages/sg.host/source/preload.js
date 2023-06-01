// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,no-undef
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('λphoton', {

    os      : 'windows',
    platform: 'electron',
    store   : 'none',
});