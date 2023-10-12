import classNames from 'classnames';
import useInputValue from '../common/hooks/useInputValue';

export default function TextArea(props: any) {
    const { id, className, onChange, value, ...rest } = props;

    const [ref, handleChange] = useInputValue({ onChange, value });

    return (
        <textarea
            {...rest}
            ref={ref}
            id={id}
            autoComplete="off"
            className={classNames(
                'block w-full rounded-sm bg-black outline-none p-2 border border-transparent focus:border-sky-500 focus:shadow-search focus:shadow-sky-400  placeholder:text-zinc-500'
            )}
            style={{ WebkitAppearance: 'none' }}
            rows={4}
            onChange={handleChange}
        />
    );
}
