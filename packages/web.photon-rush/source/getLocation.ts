export default function getLocation() {
    if (!document) return null;

    const components = document?.location.pathname.split('/');

    return components[components.length - 1] || null;
}