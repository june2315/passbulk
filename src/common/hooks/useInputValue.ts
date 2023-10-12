import { useRef, useEffect } from 'react';

interface InputChangeProps {
    value: string | number | undefined | null;
    onChange: (value, event: any) => void;
}

export default function useInputValue({ onChange, value }: InputChangeProps = {} as InputChangeProps) {
    const ref: any = useRef();

    useEffect(() => {
        ref.current.value = value || '';
    }, [value]);

    const handleChange = (event: InputEvent) => {
        onChange?.(event.target?.value, event);
    };

    return [ref, handleChange];
}
