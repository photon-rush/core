interface MagEntry {
    label    : string,
    magnitude: number,
    exponent : number,
}

const magnitudes: ReadonlyArray<MagEntry> = [
    { exponent: 3, label: 'k', magnitude: 1000 },
    { exponent: 6, label: 'm', magnitude: 1000000 },
    { exponent: 9, label: 'b', magnitude: 1000000000 },
    { exponent: 12, label: 't', magnitude: 1000000000000 },
    { exponent: 15, label: 'q', magnitude: 1000000000000000 },
];

function insertAt(str: string, index: number, insertStr: string, reverse: boolean = false): string {
    let offset = index;

    if (reverse) {
        offset = str.length - index;
    }

    return str.slice(0, offset) + insertStr + str.slice(offset);
}

function split(str: string) {
    const parts = str.split('.');

    return {
        p1: parts[0].slice(0, 3).padStart(3, '0'),
        p2: (parts[1] ?? '').slice(0, 3).padEnd(3, '0'),
    };
}

/**
 * Formats a number into 6 digits plus a sign and magnitude character. Values are truncated.
 * @param value the number to format
 * @returns returns a number formatted with a sign and magnitude
 * @example
 * ```ts
 * formatNumber(4532411.432); //returns '+004.532m'
 * ```
 */
export function formatNumber(value: number): string {
    if (value === Infinity) return '+∞∞∞.∞∞∞ ';
    if (value === -Infinity) return '-∞∞∞.∞∞∞ ';
    if (isNaN(value)) return '   NaN   ';
    if (value === 0) return ' 000.000 ';

    const abs        = Math.abs(value);
    const sign       = value > 0 ? '+' : '-';
    const $value     = abs.toString();
    const valueParse = split($value);

    if (abs < 1000) return `${sign}${valueParse.p1}.${valueParse.p2} `;

    const int                     = Math.trunc(abs);
    let magEntry: MagEntry | null = null;


    for (let j = 0; j < magnitudes.length; j++) {
        if (int < magnitudes[j].magnitude) {
            magEntry = magnitudes[j - 1];
            break;
        }
    }

    if (!magEntry) return '   NaN   ';

    const place    = insertAt(int.toString(), magEntry.exponent, '.', true);
    const intParts = split(place);

    const result = `${sign}${intParts.p1}.${intParts.p2}${magEntry.label}`;

    return result;
}