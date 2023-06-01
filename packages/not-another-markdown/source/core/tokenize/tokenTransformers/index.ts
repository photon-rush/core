import {TokenTransformer} from '@photon-rush/not-another-markdown/source/core/tokenize/TokenTransformer';
import blockquote from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/blockquote';
import callout from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/callout';
import code from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/code';
import command from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/command';
import emphasis from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/emphasis';
import heading from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/heading';
import horizontalRule from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/horizontalRule';
import image from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/image';
import lineBreak from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/lineBreak';
import orderedList from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/orderedList';
import pre from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/pre';
import strong from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/strong';
import tableDivider from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/tableDivider';
import tableRow from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/tableRow';
import unorderedList from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/unorderedList';
import link from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/link';
import definitionList from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/definitionList';
import tableCell from '@photon-rush/not-another-markdown/source/core/tokenize/tokenTransformers/tableCell';


export default TokenTransformer.fromArray([
    blockquote,
    callout,
    code,
    command,
    emphasis,
    heading,
    horizontalRule,
    image,
    lineBreak,
    link,
    orderedList,
    pre,
    strong,
    tableDivider,
    tableRow,
    unorderedList,
]);


export const unorderedListTransformers = TokenTransformer.fromArray([
    emphasis,
    image,
    lineBreak,
    link,
    pre,
    strong,
    definitionList,
]);

export const orderedListTransformers = TokenTransformer.fromArray([
    emphasis,
    image,
    lineBreak,
    link,
    pre,
    strong,
]);

export const tableTransformers = TokenTransformer.fromArray([
    emphasis,
    image,
    lineBreak,
    link,
    pre,
    strong,
    tableCell,
]);