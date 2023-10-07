import { useEffect, useState } from 'react';
import { checkIcon } from './Icons';
export default function Checkbox(props: any) {
    const [checked, setChecked] = useState(false);

    const handleChange = (event: Event) => {
        setChecked(event.target?.checked);
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
                className="h-4 w-4 rounded-sm dark:bg-neutral-900 border border-neutral-500 focus:border-neutral-400 focus:ring focus:ring-neutral-700 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                style={{ WebkitAppearance: 'none' }}
                onChange={handleChange}
            />
            {checked && (
                <span className="absolute pointer-events-none">
                    {checkIcon}
                </span>
            )}
        </div>
    );
}
