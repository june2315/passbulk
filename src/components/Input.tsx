import classNames from 'classnames';

export default function Input(props: any) {
    const { className, extraRight, addonAfter, ...rest } = props;
    return (
        <div className="flex  space-x-2">
            <div className="relative flex-1">
                <input
                    {...rest}
                    autoComplete="off"
                    className={classNames(
                        'block w-full rounded-sm bg-black outline-none p-2 border border-transparent focus:border-sky-500 focus:shadow-search focus:shadow-sky-400  placeholder:text-zinc-500'
                    )}
                    style={{ WebkitAppearance: 'none' }}
                />
                <div className="absolute right-3 top-[50%] translate-y-[-50%]">
                    {addonAfter}
                </div>
            </div>
            {extraRight}
        </div>
    );
}
