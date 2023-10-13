import { useRef, useEffect } from 'react';
import type { RefObject } from 'react';

interface InputChangeProps {
    value: string | undefined | null;
    onChange: (value, event: Event) => void;
}

export default function useInputValue(
    { onChange, value }: InputChangeProps = {} as InputChangeProps
) {
    const ref: RefObject<HTMLInputElement> = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.value = value || '';
        }
    }, [value]);

    const handleChange = (event: Event) => {
        onChange?.((event.target as HTMLInputElement)?.value, event);
    };

    return [ref, handleChange];
}
