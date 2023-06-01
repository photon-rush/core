export enum StatusType {
    Error   = 'error',
    Warning = 'warning',
    Success = 'success',
}

export interface IStatus {
    type    : StatusType,
    message : string,
    source  : string,
    location: string,
    time    : Date,
}

export interface IStatusOptions {
    type?    : boolean,
    message? : boolean,
    source?  : boolean,
    location?: boolean,
    time?    : boolean,
    color?   : boolean,
}

export function getTypeText(status: StatusType, color: boolean = false): string {
    let text;

    switch (status) {
    case StatusType.Error:
        text = ' ERROR ';
        break;
    case StatusType.Warning:
        text = 'CAUTION';
        break;
    case StatusType.Success:
        text = 'SUCCESS';
        break;
    default:
        text = 'UNKNOWN';
    }

    if (color) {
        let colorCode;
        switch (status) {
        case StatusType.Error:
            colorCode = '\x1b[1;41m';
            break;
        case StatusType.Warning:
            colorCode = '\x1b[1;43m';
            break;
        case StatusType.Success:
            colorCode = '\x1b[1;42m';
            break;
        default:
            colorCode = '\x1b[40m';
        }

        return `${colorCode}${text}\x1b[0m`;
    } else {
        return text;
    }
}

export default class Status implements IStatus {
    type    : StatusType;
    message : string;
    source  : string;
    location: string;
    time    : Date;

    constructor(status: Partial<IStatus>) {
        this.source   = status.source || '';
        this.location = status.location || '';
        this.message  = status.message || '';
        this.type     = status.type || StatusType.Success;
        this.time     = status.time || new Date();
    }

    static #create(message: string | Partial<IStatus>, source: string = '', location: string = ''): Status  {
        let status : Partial<IStatus> = {
            source,
            location,
        };

        if (typeof message === 'string') {
            status.message = message;
        } else {
            status = {
                ...status,
                ...message,
            };
        }

        return new Status(status);
    }

    toString(color: boolean = false) {
        const type     = getTypeText(this.type, color);
        const location = this.location ? `(at: ${this.location})` : '';
        const source   = this.source ?   `(from: ${this.source})` : '';
        const details  = `${source} ${location}`;

        const lines = this.message.split('\n');

        if (details) lines.push(details);

        const message = lines
            .map(line => ' '.repeat(10) + line)
            .join('\n')
            .trimStart()
            ;

        return `[${type}] ${message}`.trim();
    }

    toJson() {
        return JSON.stringify(this);
    }

    static get defaultOptions(): IStatusOptions {
        return {
            type    : true,
            message : true,
            source  : true,
            location: true,
        };
    }

    static error(message: string | Partial<IStatus>, source: string = '', location: string = ''): Status {
        const result = this.#create(message, source, location);
        result.type  = StatusType.Error;

        return result;
    }

    static warn(message: string | Partial<IStatus>, source: string = '', location: string = ''): Status {
        const result = this.#create(message, source, location);
        result.type  = StatusType.Warning;

        return result;
    }

    static success(message: string | Partial<IStatus>, source: string = '', location: string = ''): Status {
        const result = this.#create(message, source, location);
        result.type  = StatusType.Success;

        return result;
    }
}