import classNames from 'classnames';
import Button from './Button';

export default function Modal(props: any) {
    const {
        title,
        children,
        cancelText,
        okText,
        open,
        onClose,
        onOk,
        okButtonProps = {},
    } = props;
    // const [state, setState] = useSetState({});
    return (
        <div className={classNames(open ? 'block' : 'hidden')}>
            <div
                className="fixed inset-0 z-10 bg-secondary-700/50"
                onClick={onClose}
            ></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                <div className="mx-auto overflow-hidden rounded-sm bg-white dark:bg-neutral-800 dark:text-white shadow-xl sm:w-full sm:max-w-[520px]">
                    <div className="relative p-4 dark:bg-neutral-700">
                        <button
                            type="button"
                            className="absolute top-4 right-4 rounded-lg p-1 text-center font-medium transition-all hover:text-white/50"
                            onClick={onClose}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-6 w-6"
                            >
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                        <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
                            {title}
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="mt-2 text-sm text-secondary-500 dark:text-white">
                            {children}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 bg-secondary-50 dark:bg-neutral-700 px-4 py-3">
                        <button
                            type="button"
                            className="rounded-sm px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-white shadow-sm transition-all hover:text-white/50 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
                            onClick={onClose}
                        >
                            {cancelText || 'Cancel'}
                        </button>

                        <Button {...okButtonProps} primary className="h-[40px] px-4 rounded-sm" onClick={onOk}>
                            {okText || 'Confirm'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
