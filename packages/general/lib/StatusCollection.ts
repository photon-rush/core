import Status, { IStatus, StatusType } from '@photon-rush/general/lib/Status';

export default class StatusCollection {
    #statuses: Array<Status>;
    #type    : StatusType;

    constructor(statuses?: Array<Partial<IStatus>> | StatusCollection) {
        this.#statuses = [];
        this.#type     = StatusType.Success;

        if (Array.isArray(statuses)) {
            statuses.forEach(status => this.add(status));
        } else if (statuses instanceof StatusCollection) {
            statuses.toArray().forEach(status => this.add(status));
        }
    }

    get type(): StatusType { return this.#type; }
    get ok() { return this.#type === StatusType.Success || this.#type === StatusType.Warning; }

    get length(): number { return this.#statuses.length; }
    get errors(): number { return this.#statuses.filter(status => status.type === StatusType.Error).length; }
    get warnings(): number { return this.#statuses.filter(status => status.type === StatusType.Warning).length; }
    get successes(): number { return this.#statuses.filter(status => status.type === StatusType.Success).length; }

    add(status: Status | Partial<IStatus>) {
        const newStatus = new Status(status);
        this.#statuses.push(newStatus);

        if (this.#type === StatusType.Success && newStatus.type !== StatusType.Success) {
            this.#type = newStatus.type;
        } else if (this.#type === StatusType.Warning && newStatus.type === StatusType.Error) {
            this.#type = StatusType.Error;
        }
    }

    addFrom(status: Iterable<Status> | ArrayLike<Status> | Iterable<Partial<IStatus>> | ArrayLike<Partial<IStatus>> | StatusCollection) {
        if (status instanceof StatusCollection) {
            status.#statuses.forEach(status => this.add(status));
        } else {
            Array.from(status).forEach(status => this.add(status));
        }
    }

    toArray() {
        return Array.from(this.#statuses);
    }

    toString(color: boolean = false) {
        return this.#statuses
            .map(status => status.toString(color))
            .join('\n')
        ;
    }
}