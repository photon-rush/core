import BlockquoteElement from '@photon-rush/not-another-markdown/source/core/parse/elements/BlockquoteElement';
import CalloutElement from '@photon-rush/not-another-markdown/source/core/parse/elements/CalloutElement';
import CodeElement from '@photon-rush/not-another-markdown/source/core/parse/elements/CodeElement';
import CommandElement from '@photon-rush/not-another-markdown/source/core/parse/elements/CommandElement';
import DocumentElement from '@photon-rush/not-another-markdown/source/core/parse/elements/DocumentElement';
import HeadingElement from '@photon-rush/not-another-markdown/source/core/parse/elements/HeadingElement';
import OrderedListElement from '@photon-rush/not-another-markdown/source/core/parse/elements/OrderedListElement';
import ParagraphElement from '@photon-rush/not-another-markdown/source/core/parse/elements/ParagraphElement';
import SectionElement from '@photon-rush/not-another-markdown/source/core/parse/elements/SectionElement';
import TableElement from '@photon-rush/not-another-markdown/source/core/parse/elements/TableElement';
import UnorderedListElement from '@photon-rush/not-another-markdown/source/core/parse/elements/UnorderedListElement';

export default [
    DocumentElement.transformer,
    HeadingElement.transformer,
    SectionElement.transformer,
    CodeElement.transformer,
    CommandElement.transformer,
    ParagraphElement.transformer,
    CalloutElement.transformer,
    BlockquoteElement.transformer,
    OrderedListElement.transformer,
    UnorderedListElement.transformer,
    TableElement.transformer,
];