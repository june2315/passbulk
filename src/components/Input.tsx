import classNames from 'classnames';
import useInputValue from '../common/hooks/useInputValue';

export default function Input(props: any) {
    const {
        className,
        addonAfter,
        error,
        onChange,
        value,
        extra = {},
        ...rest
    } = props;

    const [ref, handleChange] = useInputValue({ onChange, value });
    return (
        <>
            <div className="flex space-x-2 items-center">
                <div className="relative flex-1">
                    <input
                        {...rest}
                        ref={ref}
                        autoComplete="off"
                        className={classNames(
                            'block w-full rounded-sm bg-black outline-none p-2 border border-transparent focus:border-sky-500 focus:shadow-search focus:shadow-sky-400  placeholder:text-zinc-500'
                        )}
                        style={{ WebkitAppearance: 'none' }}
                        onChange={handleChange}
                    />
                    <div className="absolute right-1 top-[50%] translate-y-[-50%]">
                        {addonAfter}
                    </div>
                </div>
                {extra.right}
            </div>
            {extra.bottom}
        </>
    );
}
