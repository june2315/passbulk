import ActionBar from '../../components/ActionBar';
import Button, { ActiveButton } from '../../components/Button';
import ButtonGroup from '../../components/ButtonGroup';
import Dropdown from '../../components/Dropdown';
import Aside from '../../components/Aside';
import BreadCrumb from '../../components/BreadCrumb';
import Table from '../../components/Table';
import {
    copyIcon,
    editIcon,
    shareIcon,
    exportIcon,
    plusIcon,
    uploadIcon,
    infoIcon,
    columnIcon,
    eyeIcon,
} from '../../components/Icons';
import AddPassword from './AddPassword';

import { useSetState } from 'ahooks';

export default function Passwords() {
    const [state, setState] = useSetState({
        addModalOpen: false,
        dataSource: [
            {
                name: 'test',
                username: 'admin',
            },
        ],
    });

    const handleAdd = () => {
        setState({ addModalOpen: true });
    };

    return (
        <div>
            <ActionBar
                extraLeft={[
                    <ButtonGroup key="extraLeftBtn">
                        <Button
                            key="create"
                            icon={plusIcon}
                            focusStyle={false}
                            primary
                            className="pr-4 "
                            onClick={handleAdd}
                        >
                            create
                        </Button>
                        <Button key="upload" icon={uploadIcon} />
                    </ButtonGroup>,
                ]}
                extraRight={[
                    <ButtonGroup key="extraRightBtn">
                        <Dropdown icon={columnIcon} />
                        <ActiveButton key="info" icon={infoIcon} />
                    </ButtonGroup>,
                ]}
            >
                <ButtonGroup>
                    {[
                        <Button key="copy" icon={copyIcon}>
                            copy
                        </Button>,
                        <Button key="edit" icon={editIcon}>
                            edit
                        </Button>,
                        <Button key="share" icon={shareIcon}>
                            share
                        </Button>,
                        <Button key="export" icon={exportIcon}>
                            export
                        </Button>,
                        <Dropdown key="more" items={[]}>
                            more
                        </Dropdown>,
                    ]}
                </ButtonGroup>
            </ActionBar>
            <div className="flex ">
                <Aside
                    menus={[
                        { label: 'all items', key: 'all' },
                        { label: 'favorites', key: 'favorites' },
                        { label: 'recently modified', key: 'recently' },
                        { label: 'shared with me', key: 'shared' },
                        { label: 'owned by me', key: 'owned' },
                    ]}
                />
                <main className="flex-1">
                    <BreadCrumb />

                    <Table
                        columns={[
                            { title: 'Name', dataIndex: 'name', width: 220 },
                            {
                                title: 'Password',
                                dataIndex: 'password',
                                width: 240,
                                render: () => (
                                    <div className="flex space-x-3 items-center">
                                        <span className="block hover:text-primary-red text-lg tracking-tighter cursor-pointer leading-none">
                                            ﹡﹡﹡﹡﹡﹡﹡﹡
                                        </span>
                                        <i className="cursor-pointer hover-icon-primary">
                                            {eyeIcon}
                                        </i>
                                    </div>
                                ),
                            },
                            { title: 'URI', dataIndex: 'uri', width: 300 },
                            {
                                title: 'Username',
                                dataIndex: 'username',
                                width: 200,
                            },
                            {
                                title: 'Modified',
                                dataIndex: 'modified',
                            },
                        ]}
                        rowSelection={{}}
                        dataSource={state.dataSource}
                    />
                </main>
                <AddPassword
                    open={state.addModalOpen}
                    onClose={() => setState({ addModalOpen: false })}
                />
            </div>
        </div>
    );
}
