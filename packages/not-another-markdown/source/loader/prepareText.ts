import { isWellFormed, normalizeTerminators, toWellFormed } from '@photon-rush/not-another-markdown/source/characters';

export default function prepareText(content: string, normalize: boolean): string {
    let sourceText = content;

    if (!isWellFormed(sourceText)) {
        if (normalize) {
            sourceText = toWellFormed(content);
        } else {
            throw new Error('Source Text must be well formed.');
        }
    }

    sourceText = normalizeTerminators(sourceText);

    return sourceText;
}