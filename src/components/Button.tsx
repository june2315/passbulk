import classNames from 'classnames';
import { useState } from 'react';
import type { ReactEventHandler } from 'react';

export default function Button(props: any) {
    const { primary, focusStyle = true } = props;

    return (
        <button
            type="button"
            className={classNames(
                'capitalize rounded-md border  px-3 py-2 text-center text-sm font-medium text-white shadow-sm transition-all  active:shadow-none  disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 flex items-center',
                primary
                    ? 'border-primary-500 bg-primary-500 active:bg-primary-600 active:border-primary-600 '
                    : 'border-zinc-950/50 bg-zinc-700/75 active:border-zinc-900 active:bg-zinc-900',
                focusStyle &&
                    'focus:border-sky-500 focus:shadow-search focus:shadow-sky-400',
                props.className
            )}
            onClick={props.onClick}
        >
            <span className={classNames(props.children && 'mr-2')}>
                {props.icon}
            </span>
            <span>{props.children}</span>
        </button>
    );
}

export const ActiveButton = (props: any) => {
    const [active, setActive] = useState(false);

    const handleClick = (event: ReactEventHandler) => {
        setActive(!active);
        props.onClick?.(event);
    };

    return (
        <Button
            focusStyle={false}
            {...props}
            className={classNames(props.className, active && '!bg-zinc-900')}
            onClick={handleClick}
        />
    );
};
