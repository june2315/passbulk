export function uuid(len: number) {
    const uuid = window.crypto.getRandomValues(new Uint8Array(len));

    return uuid.toString().split(',').join('');
}
