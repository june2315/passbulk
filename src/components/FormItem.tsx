import React from 'react';
import classNames from 'classnames';

export default function FormItem(props: any) {
    const { name, label, required } = props;

    return (
        <div className="relative mb-[14px]">
            <label
                htmlFor={name}
                className={classNames(
                    'block mb-3 text-[16px] font-semibold leading-none',
                    required &&
                        "after:content-['*'] after:ml-1 after:text-[#d40101] after:text-[20px] after:leading-none after:relative after:top-1"
                )}
            >
                {label}
            </label>
            {React.cloneElement(props.children, { id: name })}
        </div>
    );
}
