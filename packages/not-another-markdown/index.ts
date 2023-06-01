import { fromLocalFile } from '@photon-rush/not-another-markdown/source/loader/fromFile';

export async function main() {
    const fileLocation = '@photon-rush/not-another-markdown/readme.md';
    // const fileLocation = '@photon-rush/not-another-markdown/test-files/test.nam';
    // const fileLocation = '@photon-rush/not-another-markdown/test-files/lists.nam';
    // const fileLocation = '@photon-rush/not-another-markdown/test-files/tables.nam';
    // const fileLocation = '@photon-rush/not-another-markdown/test-files/text.nam';
    // const fileLocation = '@photon-rush/not-another-markdown/test-files/heading.nam';
    // const fileLocation = '@photon-rush/not-another-markdown/test-files/link.nam';
    // const fileLocation = '@photon-rush/not-another-markdown/test-files/quote.nam';

    await fromLocalFile(fileLocation);

}


main();