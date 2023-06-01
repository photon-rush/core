import DocumentFactory from '@photon-rush/not-another-markdown/source/core/parse/DocumentFactory';
import ElementFactory from '@photon-rush/not-another-markdown/source/core/parse/ElementFactory';
import ElementInstance from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import IParseOptions, { ParseMode } from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import elementTransformers from '@photon-rush/not-another-markdown/source/core/parse/elementTransformers';
import printElements from '@photon-rush/not-another-markdown/source/core/parse/printElements';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import StatusCollection from '@photon-rush/general/lib/StatusCollection';
import Status from '@photon-rush/general/lib/Status';

export default function parse(tokens: Array<TokenInstance>, options: IParseOptions, status: StatusCollection): Array<ElementInstance> {
    const tokenStream = new TokenStream(tokens);

    let elements: Array<ElementInstance>;

    if (options.mode === ParseMode.DOCUMENT) {
        const documentFactory = new DocumentFactory(tokenStream, elementTransformers);

        while (documentFactory.notDone) {
            documentFactory.next();
        }

        elements = Array.from(documentFactory.elements);
    } else if (options.mode === ParseMode.INLINE) {

        const elementFactory = new ElementFactory(tokenStream, elementTransformers);

        while (elementFactory.notDone) {
            elementFactory.next();
        }

        elements = Array.from(elementFactory.elements);
    } else {
        status.add(Status.error({
            message: `Unknown parse mode: ${options.mode}`,
            source : 'parse',
        }));

        elements = [];
    }

    if (options.debug) {
        console.groupCollapsed(`Tokens: ${options.fileLocation}`);
        console.log(printElements(elements));
        console.groupEnd();
    }

    return elements;
}