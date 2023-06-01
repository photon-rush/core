
import sa from '@photon-rush/general/lib/node/sa';
import { ParseMode } from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import fromString from '@photon-rush/not-another-markdown/source/loader/fromString';
import { readFile } from 'fs-extra';

export default async function fromFile(fileLocation: string) {
    const content = await readFile(fileLocation, 'utf-8');

    return fromString(content, ParseMode.DOCUMENT, fileLocation);
}

export async function fromLocalFile(packagePath: string) {
    const fileLocation = sa(packagePath);

    return fromFile(fileLocation);
}