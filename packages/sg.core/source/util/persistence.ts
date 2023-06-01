export function store(content: string, key: string) {
    if (!window.localStorage) {
        console.warn('Cannot save, local storage not available');
        return false;
    }

    window.localStorage.setItem(key, content);
}

export function retrive(key: string) {
    if (!window.localStorage) {
        console.warn('Cannot save, local storage not available');
        return null;
    }

    return window.localStorage.getItem(key);
}

export function has(key: string) {
    if (!window.localStorage) return false;

    return window.localStorage.getItem(key) !== null;
}