import classNames from 'classnames';
import { useState } from 'react';
import type { ReactEventHandler } from 'react';

import { spinIcon } from './Icons';

export default function Button(props: any) {
    const { primary, danger, disabled, loading, focusStyle = true } = props;

    const btnColorClass: string = {
        primary:
            'border-primary-500 bg-primary-500 active:bg-primary-600 active:border-primary-600 disabled:border-primary-600/75 disabled:bg-primary-500/50 disabled:opacity-75',
        default:
            'border-zinc-950/50 bg-zinc-700/75 active:border-zinc-900 active:bg-zinc-900 disabled:opacity-60',
    }[primary ? 'primary' : 'default'];

    const dangerClass = danger
        ? 'border-[#d40101] bg-[#d40101] active:border-[#d40101]/75 active:bg-[#d40101]/75 disabled:border-[#d40101]/75'
        : '';
    return (
        <button
            type="button"
            className={classNames(
                'capitalize rounded-md border px-3 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors active:shadow-none disabled:cursor-not-allowed flex items-center',
                danger ? dangerClass : btnColorClass,

                focusStyle && danger
                    ? 'focus:border-[#d40101]/60 focus:shadow-search focus:shadow-[#d40101]/60'
                    : 'focus:border-sky-500 focus:shadow-search focus:shadow-sky-400',
                props.className
            )}
            onClick={loading ? null : props.onClick}
            disabled={disabled || loading}
        >
            {props.icon ? (
                <span className={classNames(props.children && 'mr-2')}>
                    {loading ? spinIcon : props.icon}
                </span>
            ) : loading ? (
                <div className="mr-2">{spinIcon}</div>
            ) : null}

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
