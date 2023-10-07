import classNames from 'classnames';
import { useSetState } from 'ahooks';

export default function Aside(props: any) {
    const { menus = [] } = props;
    const [state, setState] = useSetState({
        activeKey: 'all',
    });

    const handleMenuClick = (menu: any) => {
        console.log('menu click');
        setState({ activeKey: menu.key });
    };
    return (
        <aside className="py-2 pr-4">
            <div className="absolute left-0 top-[178px] box-content bottom-0 w-[18rem] pr-4 bg-neutral-700/75 pointer-events-none"></div>
            <div className="relative w-[18rem] box-content z-[5]">
                {menus.map((menu: any, index: number) => (
                    <div
                        key={`menu_item_${index}`}
                        className={classNames(
                            'capitalize px-4 py-2 cursor-pointer hover:bg-neutral-600/75 mr-[-1rem]',
                            state.activeKey === menu.key && 'font-bold bg-neutral-600/75'
                        )}
                        onClick={() => handleMenuClick(menu)}
                    >
                        {menu.label}
                    </div>
                ))}
                
            </div>
        </aside>
    );
}
