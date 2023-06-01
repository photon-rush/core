import IParseOptions, {ParseMode} from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import parse from '@photon-rush/not-another-markdown/source/core/parse';
import ElementInstance from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import tokenize from '@photon-rush/not-another-markdown/source/core/tokenize';
import Result from '@photon-rush/results/source/Result';
import {isWellFormed, normalizeTerminators, toWellFormed} from '@photon-rush/not-another-markdown/source/characters';

function prepareOptions(options: Partial<IParseOptions>): Result<IParseOptions> {
    const result = new Result<IParseOptions>();

    const debug = !!options.debug;
    const mode = options.mode || ParseMode.DOCUMENT;
    const fileLocation = options.fileLocation || '';
    const idField = options.idField || 'id';

    if (options.content) {
        result.value = {
            content: options.content,
            debug,
            mode,
            fileLocation,
            idField,
        };
    } else {
        result.add({
            level: 'error',
            text: 'Cannot parse, no content was provided.',
            source: 'prepareOptions',
        });
    }

    return result;
}

function prepareText(content: string, normalize: boolean): Result<string> {
    const result = new Result<string>();

    if (isWellFormed(content)) {
        result.value = content;
    } else {
        if (normalize) {
            result.value = toWellFormed(content);
        } else {
            result.add({
                level: 'error',
                text: 'Content must be well formed unicode.',
                source: 'prepareText',
            });
        }
    }

    if (result.value) {
        result.value = normalizeTerminators(result.value);
    }

    return result;
}

export function entry(options: Partial<IParseOptions>) {
    const result = new Result<Array<ElementInstance>>();

    const optionsActual = result.extract(prepareOptions(options));

    if (!optionsActual) return result;

    const sourceText = result.extract(prepareText(optionsActual.content, true));

    if (!sourceText) return result;

    const tokens = result.extract(tokenize(sourceText, optionsActual));

    if (!tokens) return result;

    result.value = result.extract(parse(tokens, optionsActual));

    return result;
}