

////////////////////////////////////////////////////////////////////////////////////////////////////
// Types for importing via Webpack
////////////////////////////////////////////////////////////////////////////////////////////////////
declare module '*.txt' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Polyfills
////////////////////////////////////////////////////////////////////////////////////////////////////

declare module 'string.prototype.iswellformed' {
    function isWellFormed(value: string): boolean;

    export default isWellFormed;
}

declare module 'string.prototype.towellformed' {
    function toWellFormed(value: string): string;

    export default toWellFormed;
}

declare module '@photon-rush/tag' {
    export interface Tag {
        name  : string,
        hash  : string,
        branch: string,
        date  : string,
        mode  : string,
    }

    const value: Tag;

    export default value;
}