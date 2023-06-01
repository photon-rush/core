export interface ISourceLocation {
    length: number;
    position: number;
    line: number;
    column: number;
    fileLocation: string;
    valid: boolean;
}

export default class SourceLocation implements ISourceLocation {
    length: number;
    position: number;
    line: number;
    column: number;
    fileLocation: string;
    valid: boolean;

    constructor(location?: Partial<ISourceLocation> | SourceLocation | null) {
        if (!location) {
            this.length = 0;
            this.position = 0;
            this.line = 0;
            this.column = 0;
            this.fileLocation = '';
            this.valid = false;
        } else {
            this.length = location.length || 0;
            this.position = location.position || 0;
            this.line = location.line || 0;
            this.column = location.column || 0;
            this.fileLocation = location.fileLocation || '';
            this.valid = location.valid || false;
        }
    }

    toString(includeFileLocation: boolean = false) {
        const marker = this.valid ? ' ' : '!';
        const location = `[${this.line.toString().padStart(4, '0')}:${this.column.toString().padStart(3, '0')}]`;
        const file = includeFileLocation && !!this.fileLocation ? `(${this.fileLocation})` : '';

        return `${marker}${file}${location}`;
    }
}