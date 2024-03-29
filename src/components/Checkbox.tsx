import { useEffect, useState } from 'react';
import { checkIcon } from './Icons';
export default function Checkbox(props: any) {
    const { onChange, indeterminate, disabled } = props;
    const [checked, setChecked] = useState(false);

    const handleChange = (event: any) => {
        setChecked(event.target?.checked);
        onChange?.(event.target?.checked);
    };

    useEffect(() => {
        if (typeof props.checked === 'boolean') {
            setChecked(props.checked);
        }
    }, [props.checked]);

    return (
        <div className="relative flex items-center justify-center">
            <input
                type="checkbox"
                className="h-4 w-4 shrink-0 rounded-sm dark:bg-neutral-900 border border-neutral-500 focus:border-neutral-400 focus:ring focus:ring-neutral-700 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                style={{ WebkitAppearance: 'none' }}
                onChange={handleChange}
                checked={checked}
                disabled={disabled}
            />
            {!indeterminate && checked && (
                <span className="absolute pointer-events-none">
                    {checkIcon}
                </span>
            )}
            {indeterminate && (
                <i className="block absolute h-[2px] w-[7px] bg-white/75"></i>
            )}
        </div>
    );
}
