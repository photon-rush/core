import DocumentFactory from '@photon-rush/not-another-markdown/source/core/parse/DocumentFactory';
import ElementFactory from '@photon-rush/not-another-markdown/source/core/parse/ElementFactory';
import ElementInstance from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import IParseOptions, {ParseMode} from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import elementTransformers from '@photon-rush/not-another-markdown/source/core/parse/elementTransformers';
import printElements from '@photon-rush/not-another-markdown/source/core/parse/printElements';
import TokenStream from '@photon-rush/not-another-markdown/source/core/parse/TokenStream';
import TokenInstance from '@photon-rush/not-another-markdown/source/core/tokenize/TokenInstance';
import Result from '@photon-rush/results/source/Result';

export default function parse(tokens: Array<TokenInstance>, options: IParseOptions) {
    const result = new Result<Array<ElementInstance>>();

    const tokenStream = new TokenStream(tokens);

    if (options.mode === ParseMode.DOCUMENT) {
        const documentFactory = new DocumentFactory(tokenStream, elementTransformers);

        while (documentFactory.notDone) {
            documentFactory.next();
        }

        result.value = [...documentFactory.elements];
    } else if (options.mode === ParseMode.INLINE) {

        const elementFactory = new ElementFactory(tokenStream, elementTransformers);

        while (elementFactory.notDone) {
            elementFactory.next();
        }

        result.value = [...elementFactory.elements];
    } else {
        result.add({
            level: 'error',
            text: `Unknown parse mode: ${options.mode}`,
            source: 'parse',
        });
    }

    if (options.debug) {
        console.groupCollapsed(`Tokens: ${options.fileLocation}`);
        console.log(printElements(result.value));
        console.groupEnd();
    }

    return result;
}