import classNames from 'classnames';

export default function TextArea(props: any) {
    const { id, className, ...rest } = props;
    return (
        <textarea
            {...rest}
            id={id}
            autoComplete="off"
            className={classNames(
                'block w-full rounded-sm bg-black outline-none p-2 border border-transparent focus:border-sky-500 focus:shadow-search focus:shadow-sky-400  placeholder:text-zinc-500'
            )}
            style={{ WebkitAppearance: 'none' }}
            rows={4}
        />
    );
}
