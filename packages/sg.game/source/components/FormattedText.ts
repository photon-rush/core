import fromString from '@photon-rush/not-another-markdown/source/loader/fromString';
import ElementInstance, { Elements } from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import DocumentElement from '@photon-rush/not-another-markdown/source/core/parse/elements/DocumentElement';
import HeadingElement from '@photon-rush/not-another-markdown/source/core/parse/elements/HeadingElement';
import TextElement from '@photon-rush/not-another-markdown/source/core/parse/elements/TextElement';

import React from 'react';

const h = React.createElement;

export interface IFormattedText {
    notMarkdownText: string,
}

const conversionTable: Partial<Record<Elements, (element: any) => React.DOMElement<React.DOMAttributes<Element>, Element>>> = {};

conversionTable[Elements.HEADING] = (element: HeadingElement) => h(`h${element.level}`, { key: element.id }, element.text);
conversionTable[Elements.TEXT]    = (element: TextElement) => h('p', { key: element.id }, element.text);


export default class FormattedText extends React.Component<IFormattedText> {
    render() {
        const content     = this.props.notMarkdownText;
        const parseResult = fromString(content);

        if (parseResult) {
            // console.log((parseResult.value[0] as DocumentElement).content);
        } else {
            // console.log(parseResult.pretty());
        }

        // console.log(this);

        return h('div', null, [
            this.prepare(parseResult.elements[0]),
            h('pre', { key: 'blarg' }, content),
        ]);
    }

    prepare(parseResult: ElementInstance) {
        const parent = parseResult;

        if (parent instanceof DocumentElement) {
            return this.translate(parent.content.children);
        } else {
            return this.translate(parent.children);
        }

    }

    translate(elements: ReadonlyArray<ElementInstance>) {

        const children = elements.map(e => {
            const convertor = conversionTable[e.type];

            if (convertor) {
                return convertor(e);
            } else {
                return h('p', {
                    key     : e.id,
                    children: `Unknown Type: ${e.type} (${e.id})`,
                });
            }
        });

        //console.log(children);

        return h('section', { key: 'blah' }, ...children);
    }


}