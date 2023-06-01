import ElementInstance from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';

export default function printElements(elements?: ReadonlyArray<ElementInstance> | null) {
    if (!elements) return '<No Elements>';

    const struct = elements.map(e => e.toSimpleElement());

    return JSON.stringify(struct, null, 2);
}