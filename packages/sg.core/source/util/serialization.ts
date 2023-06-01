import { ISimplePhotonObject } from '@photon-rush/sg.core/source/photon/IPhotonObject';

enum SpecialType {
    NOT_A_NUMBER      = '☠nan',
    INFINITY_POSITIVE = '☠pi',
    INFINITY_NEGATIVE = '☠ni',
    DATE              = '☠date'
}


/**
 * Translates an object graph in to JSON while alleviating some of the limitations of JSON (dates and numbers mostly)
 *
 * Supports:
 * - NaN, Infinity numbers
 * - ISO Dates
 *
 * These are stored as special objects that contain additional type information.
 * __Note__: The other major limitation of JSON.stringify still applies: objects must be acyclic
 * @param objects
 */
export function serialize(objects: Record<string, ISimplePhotonObject>): string {
    return JSON.stringify(serializeValue(objects));
}

export function deserialize(json: string) {
    const raw = JSON.parse(json);

    if (Array.isArray(raw)) throw new Error('Data must be Record<string, ISimplePhotonObject>');
    if (typeof raw !== 'object') throw new Error('Data must be Record<string, ISimplePhotonObject>');

    const result = deserializeValue(raw);

    return result as Record<string, ISimplePhotonObject>; //TODO better validation?
}

function deserializeValue(value: any) {
    if (Array.isArray(value)) {
        const result: Array<any> = [];

        value.forEach(item => result.push(deserializeValue(item)));

        return result;
    } else if (typeof value === 'object') {
        if (value.type) {
            switch (value.type) {
            case SpecialType.DATE:
                return new Date(Date.parse(value.value));
            case SpecialType.INFINITY_POSITIVE:
                return Infinity;
            case SpecialType.INFINITY_NEGATIVE:
                return -Infinity;
            case SpecialType.NOT_A_NUMBER:
                return NaN;
            }
        }

        const result: Record<string, any> = {};

        Object.keys(value)
            .forEach(key => result[key] = deserializeValue(value[key]));

        return result;
    } else {
        return value;
    }
}

function serializeValue(value: any) {
    if (typeof value === 'number') {
        if (Number.isNaN(value)) {
            return { type: SpecialType.NOT_A_NUMBER };
        } else if (value === Infinity) {
            return { type: SpecialType.INFINITY_POSITIVE };
        } else if (value === -Infinity) {
            return { type: SpecialType.INFINITY_NEGATIVE };
        }

        return value;
    } else if (value instanceof Date) {
        return {
            type : SpecialType.DATE,
            value: value.toISOString(),
        };
    } else if (Array.isArray(value)) {
        const result: Array<any> = [];

        value.forEach(item => {
            result.push(serializeValue(item));
        });

        return result;
    } else if (typeof value === 'object') {
        const result: any = {};

        Object.keys(value)
            .forEach(key => result[key] = serializeValue(value[key]));

        return result;
    } else {
        return value;
    }
}