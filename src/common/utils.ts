// import React from 'react';

export function uuid(len: number) {
    const uuid = window.crypto.getRandomValues(new Uint8Array(len));

    return uuid.toString().split(',').join('');
}

export function isFunction(obj: any): obj is (...args: any[]) => any {
    return typeof obj === 'function';
}

export function isEmptyObject(obj: any): boolean {
    return isObject(obj) && Object.keys(obj).length === 0;
}

export function isNull(obj: any): obj is null {
    return obj === null;
}

export function isNullOrUndefined(obj: any): boolean {
    return obj === null || obj === undefined;
}

export function isBoolean(value: any): value is Boolean {
    return typeof value === 'boolean';
}

const opt = Object.prototype.toString;

export function isArray(obj: any): obj is any[] {
    return opt.call(obj) === '[object Array]';
}

export function isObject(obj: any): obj is { [key: string]: any } {
    return opt.call(obj) === '[object Object]';
}

export function isString(obj: any): obj is string {
    return opt.call(obj) === '[object String]';
}

export function isUndefined(obj: any): obj is undefined {
    return obj === undefined;
}


// delete keys from object
export function omit<T extends object, K extends keyof T>(
    obj: T,
    keys: Array<K | string> // string 为了某些没有声明的属性被omit
): Omit<T, K> {
    const clone = {
        ...obj,
    };
    keys.forEach((key) => {
        if ((key as K) in clone) {
            delete clone[key as K];
        }
    });
    return clone;
}
