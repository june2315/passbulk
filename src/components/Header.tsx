import passbulkLogo from '../assets/passbulk_logo.svg';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import classNames from 'classnames';
import { useSetState, useUpdateEffect } from 'ahooks';

export default function Header(props) {
    const searchInputRef: RefObject<HTMLInputElement> = useRef(null);
    const [state, setState] = useSetState({
        infoOpen: false,
    });

    useEffect(() => {
        document.addEventListener('click', handleInfoBlur);
        return () => {
            document.removeEventListener('click', handleInfoBlur);
        };
    }, []);

    useUpdateEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.value = props.searchValue;
        }
    }, [props.searchValue]);

    const handleInfoToggle = (event: any) => {
        event.stopPropagation();
        setState({ infoOpen: !state.infoOpen });
    };

    const handleInfoBlur = () => {
        setState({ infoOpen: false });
    };

    const handleSearchKeyDown = (event) => {
        if (event.code === 'Enter') {
            props.onSearchConfirm?.(event.target.value);
        }
    };

    const menus = [
        { label: 'passwords' },
        { label: 'users' },
        { label: 'setting' },
        { label: 'help' },
    ];

    const itemCls =
        'cursor-pointer text-zinc-400 hover:text-zinc-50 transition-colors duration-300';
    return (
        <div>
            {/* top bar */}
            <div className="flex items-center justify-between px-1 ">
                <ul className="flex space-x-6 p-3  ">
                    {menus.map((d: any, i: number) => (
                        <li key={'item_' + i} className={itemCls}>
                            {d.label}
                        </li>
                    ))}
                </ul>

                <div className={`p-3 ${itemCls}`}>sign out</div>
            </div>

            {/* search and user info */}
            <div className="flex p-2 px-4 items-center  bg-search-gray">
                <div className="relative top-[4px] w-[18rem]">
                    <img
                        src={passbulkLogo}
                        className="block "
                        style={{ height: 45 }}
                    />
                </div>

                <div className="flex-1">
                    <div className="relative w-[38rem]">
                        <input
                            ref={searchInputRef}
                            className="block rounded-md bg-black py-2 px-3 w-full outline-none border border-transparent focus:outline-none  focus:border-sky-500 focus:shadow-search focus:shadow-sky-400 placeholder:italic placeholder:text-zinc-500"
                            placeholder="Search passwords"
                            onChange={props.onSearchChange}
                            onKeyDown={handleSearchKeyDown}
                        />

                        <span className="absolute inset-y-0 right-3 flex items-center pl-2 cursor-pointer">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.33335 9.16666C3.33335 5.94501 5.94503 3.33333 9.16669 3.33333C12.3884 3.33333 15 5.94501 15 9.16666C15 12.3883 12.3884 15 9.16669 15C5.94503 15 3.33335 12.3883 3.33335 9.16666ZM9.16669 1.66666C5.02455 1.66666 1.66669 5.02453 1.66669 9.16666C1.66669 13.3088 5.02455 16.6667 9.16669 16.6667C10.9375 16.6667 12.565 16.0529 13.8481 15.0266L16.9108 18.0892C17.2362 18.4147 17.7639 18.4147 18.0893 18.0892C18.4147 17.7638 18.4147 17.2362 18.0893 16.9107L15.0266 13.8481C16.0529 12.565 16.6667 10.9375 16.6667 9.16666C16.6667 5.02453 13.3089 1.66666 9.16669 1.66666Z"
                                    fill="white"
                                />
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="relative min-w-[15rem]">
                    <div
                        className={classNames(
                            'flex items-center p-2 px-4  rounded-md space-x-4 cursor-pointer border border-solid ',
                            state.infoOpen
                                ? 'bg-zinc-900 rounded-b-none border-transparent'
                                : 'bg-zinc-700/60 border-black/50'
                        )}
                        onClick={handleInfoToggle}
                    >
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-secondary-100">
                            <svg
                                className="h-1/2 w-1/2 text-secondary-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h1 1 14H20z"></path>
                            </svg>
                        </div>
                        <div className="flex-1 pr-4">
                            <div className="font-semibold leading-none capitalize">
                                user name
                            </div>
                            <div className="leading-none mt-1 font-light text-zinc-200">
                                account
                            </div>
                        </div>

                        <div>
                            <svg
                                width="10px"
                                height="10px"
                                viewBox="0 -4.5 20 20"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>arrow_down [#338]</title>
                                <desc>Created with Sketch.</desc>
                                <defs></defs>
                                <g
                                    id="Page-1"
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="none"
                                    fillRule="evenodd"
                                >
                                    <g
                                        transform="translate(-220.000000, -6684.000000)"
                                        fill="white"
                                    >
                                        <g
                                            id="icons"
                                            transform="translate(56.000000, 160.000000)"
                                        >
                                            <path
                                                d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
                                                id="arrow_down-[#338]"
                                            ></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            'absolute bg-zinc-900 w-full shadow-md py-1 z-10',
                            state.infoOpen ? 'block' : 'hidden'
                        )}
                    >
                        {[{ label: 'profile' }, { label: 'theme' }].map(
                            (d: any, i: number) => (
                                <div
                                    key={`info_${i}`}
                                    className="capitalize p-4 py-2 cursor-pointer text-[15px] hover:bg-zinc-700/75"
                                >
                                    {d.label}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
