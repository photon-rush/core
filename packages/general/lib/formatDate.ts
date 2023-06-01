export function formatDate(date: Date): string {
    const year  = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day   = date.getDay().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}


export function formatTime(date: Date): string {
    const hour   = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${hour}:${minute}:${second}`;
}

export function formateDateTime(date: Date): string {
    const dateString = formatDate(date);
    const timeString = formatTime(date);

    return `${dateString} ${timeString}`;
}