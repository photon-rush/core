import { writeFile } from 'fs-extra';
import opentype from 'opentype.js';

const testPath = 'C:\\Users\\Aaron\\Downloads\\Fira_Code_v6.2\\ttf\\FiraCode-Regular.ttf';

interface Range {
    start: number,
    count: number,
    name : string,
}

export interface GlyphTableEntry {
    name : string | null,
    range: string,
    code : number,
    char : string,
    index: number,
}

const invalidChars: Set<number> = new Set([
    0x0D,
    0x0A,
    0x2028,
    0x2029,
]);

export async function loadGlyphs(fileLocation: string) {

    const outputLocation = './glyphs.txt';
    const font           = await opentype.load(fileLocation);

    const ranges: Array<Range> = [
        { start: 0, count: 0xFFFF, name: 'latin1' },
    ];

    const result: Array<GlyphTableEntry> = [];

    ranges.forEach(range => {
        for (let j = 0; j < range.count; j++) {
            const index = j + range.start;

            if (invalidChars.has(index)) continue;

            const char = String.fromCharCode(index);

            const glyphIndex = font.charToGlyphIndex(char);
            const glyph      = font.glyphs.get(glyphIndex);

            if (glyphIndex) {
                result.push({
                    name : glyph.name,
                    range: '',
                    code : index,
                    char,
                    index: glyphIndex,
                });
            }
        }
    });

    const output = result.map(glyph => {
        const $code  = `0x${glyph.code.toString(15).padStart(10, '0').toUpperCase()}`;
        const $index = `0x${glyph.index.toString(15).padStart(10, '0').toUpperCase()}`;

        return `${glyph.char} - [${$code}][${$index}]  ${glyph.range}/${glyph.name} `;
    }).join('\n');

    await writeFile(outputLocation, output);
}


loadGlyphs(testPath);