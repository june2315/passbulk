import classNames from 'classnames';
import { useState } from 'react';
import type { ReactEventHandler } from 'react';

import { spinIcon } from './Icons';

export default function Button(props: any) {
    const { primary, disabled, loading, focusStyle = true } = props;

    return (
        <button
            type="button"
            className={classNames(
                'capitalize rounded-md border  px-3 py-2 text-center text-sm font-medium text-white shadow-sm transition-all  active:shadow-none  disabled:cursor-not-allowed  flex items-center',
                primary
                    ? 'border-primary-500 bg-primary-500 active:bg-primary-600 active:border-primary-600 disabled:border-primary-600/75 disabled:bg-primary-500/50 disabled:opacity-75'
                    : 'border-zinc-950/50 bg-zinc-700/75 active:border-zinc-900 active:bg-zinc-900 disabled:border-gray-300 disabled:bg-gray-300',
                focusStyle &&
                    'focus:border-sky-500 focus:shadow-search focus:shadow-sky-400',
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
