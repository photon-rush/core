import IParseOptions, { ParseMode } from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import parse from '@photon-rush/not-another-markdown/source/core/parse';
import ElementInstance from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import tokenize from '@photon-rush/not-another-markdown/source/core/tokenize';
import { isWellFormed, normalizeTerminators, toWellFormed } from '@photon-rush/not-another-markdown/source/characters';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';
import Status from '@photon-rush/general/lib/Status';

function prepareOptions(options: Partial<IParseOptions>, status: StatusCollection): IParseOptions | null {
    const debug        = !!options.debug;
    const mode         = options.mode || ParseMode.DOCUMENT;
    const fileLocation = options.fileLocation || '';
    const idField      = options.idField || 'id';

    if (options.content) {
        return {
            content: options.content,
            debug,
            mode,
            fileLocation,
            idField,
        };
    } else {
        status.add(Status.error({
            message: 'Cannot parse, no content was provided.',
            source : 'prepareOptions',
        }));

        return null;
    }
}

function prepareText(content: string, normalize: boolean, status: StatusCollection): string {
    let result: string = '';

    if (isWellFormed(content)) {
        result = content;
    } else {
        if (normalize) {
            result = toWellFormed(content);
        } else {
            status.add(Status.error({
                message: 'Content must be well formed unicode.',
                source : 'prepareText',
            }));
        }
    }

    return normalizeTerminators(result);
}

export interface INAMResult {
    elements: Array<ElementInstance>,
    status  : StatusCollection,
}

export function entry(options: Partial<IParseOptions>): INAMResult {
    const result:INAMResult = {
        status  : new StatusCollection,
        elements: [],
    };

    const optionsActual = prepareOptions(options, result.status);

    if (!optionsActual) return result;

    const sourceText = prepareText(optionsActual.content, true, result.status);

    if (!sourceText) return result;

    const tokens = tokenize(sourceText, optionsActual);

    result.elements = parse(tokens, optionsActual, result.status);

    return result;
}