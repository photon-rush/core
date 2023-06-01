import { IPhotonObject, ISimplePhotonObject } from '@photon-rush/sg.core/source/photon/IPhotonObject';

export enum Page {
    EMPTY    = 'empty',
    ABOUT    = 'about',
    LANDING  = 'landing',
    SETTINGS = 'settings',
    TITLE    = 'title',
    START    = 'start',
}

export const defaultPage: Page = Page.START;
export const defaultFrame: boolean = false;

export interface IController {
    page : Page,
    frame: boolean,
}

export interface PageSwitchEvent {
    previous: Page,
    next    : Page,
    frame   : boolean,
}

export default class Controller implements IPhotonObject<IController> {
    #page: Page;

    frame: boolean;

    constructor(controller: IController) {
        this.#page = controller.page;
        this.frame = controller.frame;
    }

    get page() { return this.#page; }

    navigate(name: Page) {
        console.log(`navigate: ${name}`);
        const event = new CustomEvent<PageSwitchEvent>('pageSwitch', {
            detail: {
                previous: this.#page,
                next    : name,
                frame   : this.frame,
            },
        });

        this.#page = name;

        dispatchEvent(event);
    }

    transition(to: Page, hold: number) {
        console.log(`transition: ${to} (${hold})`);
        //TODO: Transit Queue
        setTimeout(() => {
            this.navigate(to);
        }, hold);
    }

    simplify(): IController {
        return {
            page : this.page,
            frame: this.frame,
        };
    }

    save(): ISimplePhotonObject & IController {
        return {
            type: Controller.type,
            ...this.simplify(),
        };
    }

    copy(): IPhotonObject<IController> {
        return new Controller(JSON.parse(JSON.stringify(this.simplify())));
    }

    equals(o?: IController | null | undefined): boolean {
        if (!o) return false;

        return this.page === o.page;
    }

    static get type() { return 'controller';}
}