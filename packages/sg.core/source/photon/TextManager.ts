export default class TextManager {
    private _textRecords: Record<string, Record<string, string>>;


    constructor() {
        this._textRecords = {};
    }


    add(section: string, key: string, value: string) {
        if (!this._textRecords[section]) {
            this._textRecords[section] = {};
        }

        if (this._textRecords[section][key]) {
            throw new Error(`Key ${key} already exists in section ${section}`);
        }

        this._textRecords[section][key] = value;
    }
}