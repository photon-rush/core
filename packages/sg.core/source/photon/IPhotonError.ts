import { IPhotonObject, ISimplePhotonObject } from '@photon-rush/sg.core/source/photon/IPhotonObject';

export interface ISGError {
    message : string,
    fatal   : boolean,
    stamp   : number,
    location: string,
}

export default class IPhotonError implements IPhotonObject<ISGError> {
    private _message : string;
    private _fatal   : boolean;
    private _stamp   : Date;
    private _source  : Error | null;
    private _location: string;

    constructor(sgError: ISGError);
    constructor(sgError: IPhotonError);
    constructor(message: string, location: string, fatal?: boolean, source?: Error | null);
    constructor(message: string | IPhotonError | ISGError = 'An error occurred', location: string = '', fatal?: boolean, source?: Error | null) {
        if (typeof message === 'string') {
            this._message  = message;
            this._location = location;
            this._fatal    = fatal || false;
            this._stamp    = new Date();
            this._source   = source || null;
        } else if (message instanceof IPhotonError) {
            this._message  = message.message;
            this._location = message.location;
            this._fatal    = message.fatal;
            this._source   = message.source;
            this._stamp    = message.stamp;
        } else {
            this._message  = message.message;
            this._location = message.location;
            this._fatal    = message.fatal;
            this._source   = null;
            this._stamp    = new Date(message.stamp);
        }
    }

    get message() { return this._message; }

    get location() { return this._location; }

    get fatal() { return this._fatal; }

    get stamp() { return this._stamp; }

    get source() { return this._source; }

    static fromError(error: Error, fatal = false) {
        let location = '';

        if (error.stack) {
            location = error.stack.split('\n')[0];
        }

        return new IPhotonError(error.message, location, fatal, error);
    }

    simplify(): ISGError {
        return {
            message : this.message,
            fatal   : this.fatal,
            stamp   : this.stamp.getTime(),
            location: this.location,
        };
    }

    copy(): IPhotonError {
        return JSON.parse(JSON.stringify(this.simplify()));
    }

    save(): ISimplePhotonObject & ISGError {
        return {
            type: 'error',
            ...this.simplify(),
        };
    }

    equals(): boolean { return false; }

    toString() {
        return `${this.fatal ? 'FATAL ' : ''} ${this.message} (${this.location})`;
    }
}