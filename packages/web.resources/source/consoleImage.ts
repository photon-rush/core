export default async function consoleImage(dataUrl: string, width: string = '200px', height: string = '200px') {
    const style = `
padding: ${height} ${width};
background: url("${dataUrl}");
background-repeat: no-repeat;
display: inline-block;
    `.trim();

    console.log('%c ', style);
}

export function attach() {
    if (!(console as any).image) (console as any).image = consoleImage;
}