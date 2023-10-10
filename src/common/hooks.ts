import { useEffect, useState } from 'react';
interface cssClass {
    base: string;
    [key: string]: string;
}

export function useCssClassManager(cssClassMap: cssClass) {
    const [classMap, setClassMap] = useState<cssClass>({
        base: cssClassMap.base,
    });
    const [classList, setClassList] = useState('');

    const removeClassName = (classKey: string) => {
        setClassMap((prev) => {
            const template = { ...prev };
            delete template[classKey];
            return template;
        });
    };

    const addClassName = (classKey: string) => {
        setClassMap((prev) => ({ ...prev, [classKey]: cssClassMap[classKey] }));
    };

    const hasClassName = (className: string) => {
        return Object.keys(classMap).find((c: string) => c === className);
    };

    useEffect(() => {
        setClassList(Object.values(classMap).join(' '));
    }, [classMap]);

    return {
        removeClassName,
        addClassName,
        classList,
        hasClassName,
    };
}
