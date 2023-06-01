import '@photon-rush/sg.game/source/components/typer.scss';
import { ParseMode } from '@photon-rush/not-another-markdown/source/core/IParseOptions';
import ElementInstance from '@photon-rush/not-another-markdown/source/core/parse/ElementInstance';
import CommandElement from '@photon-rush/not-another-markdown/source/core/parse/elements/CommandElement';
import TextElement from '@photon-rush/not-another-markdown/source/core/parse/elements/TextElement';
import fromString from '@photon-rush/not-another-markdown/source/loader/fromString';
import { getRandomInt, pick } from '@photon-rush/sg.core/source/util/rng';
import sequence, { SequenceFn } from '@photon-rush/sg.core/source/util/sequence';
import React from 'react';


const glitchLetters = Array.from('*+-÷/λ@_§±¿¡×$∞[∴%‰∫£¢¤€¥!X₹O1₽ℤ&');
const CHAR_TIMER    = 100;

interface ITyperProps {
    content    : string,
    speed?     : number,
    onComplete?: () => void,
}

function createMarker() {
    const element = document.createElement('span');

    element.style.whiteSpace = 'pre';
    element.innerText        = '█';

    return element;
}

function setMarker(entry: ICharEntry, element: HTMLElement) {
    if (entry.color) element.style.color = entry.color;
    if (entry.bold) element.style.fontWeight = 'bold';

    if (entry.glitch) {
        const first = pick(glitchLetters);

        element.setAttribute('data-text', first);
        element.innerText = first;

        setTimeout(() => {
            element.className = 'glitch';
            const handle      = setInterval(() => {
                if (!element.isConnected) {
                    clearInterval(handle);
                    return;
                }

                const c = pick(glitchLetters);
                element.setAttribute('data-text', c);
                element.innerText = c;
            }, 1000);
        }, getRandomInt(100, 500));
    } else {
        element.innerText = entry.value;
    }
}

interface ICharEntry {
    color : string,
    value : string,
    bold  : boolean,
    glitch: boolean,
}

function generator(rootElement: HTMLElement, items: Array<ElementInstance>): Array<SequenceFn> {
    //TODO: This is _after_ I tested for vs forEach needs some major perf improvements

    let lineElement = document.createElement('div');
    rootElement.append(lineElement);
    lineElement.append(createMarker());

    return items.map(item => item.children)
        .map(item => {
            let color  = '';
            let glitch = false;

            return [...item.map(child => {
                if (child instanceof TextElement) {
                    return Array.from(child.text)
                        .map(c => ({
                            color,
                            glitch,
                            bold : child.hasEmphasis || child.hasStrength,
                            value: c,
                        }));
                } else if (child instanceof CommandElement) {
                    if (child.name === 'color') color = child.parameters[0];
                    if (child.name === 'glitch') glitch = true;
                    if (child.name === 'reset') {
                        color  = '';
                        glitch = false;
                    }
                }

                return {
                    color: '',
                    bold : false,
                    value: '',
                } as ICharEntry;
            }), null];
        })
        .flat(2)
        .map((item: ICharEntry | null) => (() => {
            if (item === null) {
                if (lineElement.lastElementChild) lineElement.removeChild(lineElement.lastElementChild);

                lineElement = document.createElement('div');
                rootElement.append(lineElement);
                lineElement.append(createMarker());
            } else {
                setMarker(item, lineElement.lastElementChild as HTMLSpanElement);

                lineElement.append(createMarker());
            }

            return getRandomInt(-100, 100);
        }),
        )
    ;
}

export default class Typer extends React.Component<ITyperProps> {
    rootElementReference;


    constructor(props: ITyperProps) {
        super(props);

        this.rootElementReference = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        const rootElement = this.rootElementReference.current;

        if (!rootElement) return;

        const parseResult = fromString(this.props.content, ParseMode.INLINE);

        const parsedContent = parseResult.elements;
        let speed           = CHAR_TIMER;

        if (typeof this.props.speed !== 'undefined') speed = this.props.speed;

        const seq = generator(rootElement, parsedContent);
        sequence(seq, speed, () => {
            console.log('done!');
            if (rootElement.lastElementChild) rootElement.removeChild(rootElement.lastElementChild);

            if (this.props.onComplete) this.props.onComplete();
        });

    }


    render() {
        return (
            <div className="typer-container">
                <div ref={this.rootElementReference}></div>
            </div>
        );
    }
}