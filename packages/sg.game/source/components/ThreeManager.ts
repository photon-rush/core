import {
    Camera,
    Renderer,
    Scene,
    Vector3,
} from 'three';
import * as THREE from 'three';


function addHexagon(radius: number, location: Vector3, points: Array<Vector3>) {
    const radiusHalf = radius * .5;

    points.push(new Vector3(radius, 0, 0).add(location));
    points.push(new Vector3(radiusHalf, -radius, 0).add(location));
    points.push(new Vector3(radiusHalf, -radius, 0).add(location));
    points.push(new Vector3(-radiusHalf, -radius, 0).add(location));
    points.push(new Vector3(-radiusHalf, -radius, 0).add(location));
    points.push(new Vector3(-radius, 0, 0).add(location));
    points.push(new Vector3(-radius, 0, 0).add(location));
    points.push(new Vector3(-radiusHalf, radius, 0).add(location));
    points.push(new Vector3(-radiusHalf, radius, 0).add(location));
    points.push(new Vector3(radiusHalf, radius, 0).add(location));
    points.push(new Vector3(radiusHalf, radius, 0).add(location));
    points.push(new Vector3(radius, 0, 0).add(location));

}

function constructHexagonGrid(radius: number, rows: number = 64, columns: number = 64) {
    const radiusHalf   = radius * .5;
    const radiusDouble = radius * 2;

    const points: Array<Vector3> = [];

    const location = new Vector3();
    for (let y = 0; y < columns; y++) {
        location.add(new Vector3(0, radiusDouble, 0));

        for (let x = 0; x < rows; x++) {
            const offset = x % 2 ? radius : 0;

            const pX = ((radiusDouble - radiusHalf) * x);
            const pY = (radiusDouble * y) + offset;

            addHexagon(radius, new Vector3(pX, pY), points);
        }
    }

    console.log(points);

    const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line     = new THREE.LineSegments(geometry, material);

    return line;
}


export default class ThreeManager {
    readonly #scene   : Scene;
    readonly #renderer: Renderer;
    readonly #camera  : Camera;

    constructor(canvasElement: HTMLCanvasElement) {
        this.#scene    = new THREE.Scene();
        this.#camera   = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.#renderer = new THREE.WebGLRenderer({
            canvas   : canvasElement,
            antialias: false,
        });

        console.log(canvasElement);

        this.#renderer.setSize(512, 512);


        const material = new THREE.PointsMaterial({ color: 0xFF00FF });
        const geometry = new THREE.BufferGeometry().setFromPoints([new Vector3()]);
        const center   = new THREE.Points(geometry, material);


        this.#scene.add(constructHexagonGrid(2));
        this.#scene.add(center);


        this.#camera.position.z = 20;

        this.update();
    }

    onWindowResize(viewportWidth: number, viewportHeight: number) {
        console.log(`${viewportWidth}x${viewportHeight}`);
        //this.#renderer.setSize(viewportWidth, viewportHeight);
    }

    update() {

        this.#renderer.render(this.#scene, this.#camera);

        requestAnimationFrame(this.update.bind(this));
    }
}