import classNames from 'classnames';
import { arrowDownIcon } from '../components/Icons';
import { useSetState } from 'ahooks';
import { useEffect, useRef } from 'react';

export default function Dropdown(props: any) {
    const { items = [] } = props;

    const dropdownRef: any = useRef();
    const wrapRef: any = useRef();

    const [state, setState] = useSetState({
        isOpen: false,
        hideTrRounded: false,
        isOverScreen: false,
    });

    useEffect(() => {
        document.addEventListener('click', function close() {
            setState({ isOpen: false });
        });
        return () => {
            document.removeEventListener('click', close);
        };
    }, []);

    useEffect(() => {
        if (state.isOpen) {
            const wrapRect = wrapRef.current.getBoundingClientRect();
            const dropRect = dropdownRef.current.getBoundingClientRect();

            setState({
                hideTrRounded:
                    parseInt(wrapRect.width) === parseInt(dropRect.width),
                isOverScreen:
                    dropRect.left + dropRect.width > window.innerWidth - 100,
            });
        }
    }, [state.isOpen]);

    const toggleOpen = (event: any) => {
        event.stopPropagation();
        setState({ isOpen: !state.isOpen });
    };

    return (
        <div
            ref={wrapRef}
            className={classNames(
                'capitalize text-center rounded-md text-sm font-medium text-white shadow-sm transition-colors active:border-zinc-900 active:bg-zinc-900 active:shadow-none focus:border-sky-500 focus:shadow-search focus:shadow-sky-400 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300',
                'relative',
                state.isOpen ? 'rounded-b-none border-b-0' : ''
            )}
        >
            <div
                className={classNames(
                    'flex items-center px-3 py-2 rounded-md border border-zinc-950/50 bg-zinc-700/50 box-border',
                    state.isOpen ? 'rounded-b-none border-b-0' : ''
                )}
                onClick={toggleOpen}
            >
                <div>{props.icon}</div>
                <div className={classNames(props.children && 'pl-2')}>
                    {props.children}
                </div>
                <div className="ml-3">{arrowDownIcon}</div>
            </div>

            <div
                className={classNames(
                    'absolute w-full bottom-[-1px] border-x border-[#202021] z-20',
                    state.isOpen ? 'block' : 'hidden'
                )}
            >
                <div className="relative w-full h-[1px] top-[0px] bg-[#363639]"></div>
            </div>
            <div
                ref={dropdownRef}
                className={classNames(
                    'absolute bg-[#363639] shadow-md py-1 z-10',
                    'top-[100%] border border-zinc-950/50 min-w-full rounded-md ',
                    state.isOverScreen
                        ? 'right-0 rounded-tr-none'
                        : 'left-0 rounded-tl-none',
                    state.hideTrRounded
                        ? state.isOverScreen
                            ? 'rounded-tl-none'
                            : 'rounded-tr-none'
                        : '',
                    state.isOpen ? 'block' : 'hidden'
                )}
            >
                {items.map((d: any, i: number) => (
                    <div
                        key={`menu_${i}`}
                        className={classNames(
                            'capitalize p-4 py-2 cursor-pointer text-[15px] hover:bg-zinc-700/75 border-1-top'
                        )}
                    >
                        {d.label}
                    </div>
                ))}
                {!items.length ? (
                    <div className="p-4 py-1 whitespace-nowrap">No items</div>
                ) : null}
            </div>
        </div>
    );
}
