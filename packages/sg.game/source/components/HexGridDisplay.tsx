import HexGrid from '@photon-rush/sg.core/source/objects/HexGrid';
import HexPoint from '@photon-rush/sg.core/source/objects/HexPoint';
import Point from '@photon-rush/sg.core/source/objects/Point';
import React, { PropsWithoutRef } from 'react';


const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

interface IContent {
    points: string,
}


function createHexagonElement(location: HexPoint) {
    const points = location.toPointsString(new Point(64, 64));

    const element = document.createElementNS(SVG_NAMESPACE, 'polygon');
    element.setAttribute('id', location.id);
    element.setAttribute('points', points);

    return element;
}

export default class HexGridDisplay extends React.Component {
    svgReference;
    grid: HexGrid<IContent>;


    constructor(props: PropsWithoutRef<any>) {
        super(props);
        this.svgReference = React.createRef<SVGSVGElement>();
        this.grid         = new HexGrid<IContent>(1, { points: '' });
    }

    componentDidMount() {
        const svgElement = this.svgReference.current;

        if (!svgElement) {
            console.warn('Missing SVG Element in HexGrid');
            return;
        }

        svgElement.setAttribute('stroke', 'rgba(255, 255, 255, 1)');
        svgElement.setAttribute('stroke-width', '4');
        svgElement.setAttribute('viewBox', '0, -250, 1000, 1000');
        svgElement.style.width  = '100%';
        svgElement.style.height = '512px';

        this.grid.forEach(cell => {
            const element = createHexagonElement(cell.location);
            svgElement.append(element);
        });

        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        // Someday we will do something about this
    };

    render() {
        return (
            <div className="canvasContainer">
                <svg ref={this.svgReference}></svg>
            </div>
        );
    }
}