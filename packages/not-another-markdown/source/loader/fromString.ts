import { entry } from '@photon-rush/not-another-markdown/source/core';
import { ParseMode } from '@photon-rush/not-another-markdown/source/core/IParseOptions';

export default function fromString(content: string, mode: ParseMode = ParseMode.DOCUMENT, fileLocation?: string | null) {
    return entry({
        content,
        mode,
        fileLocation: fileLocation || '',
    });
}