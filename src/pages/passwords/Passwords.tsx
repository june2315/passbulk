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

import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';

export default function Passwords() {
    const [state, setState] = useSetState({
        addModalOpen: false,
        addSubmitLoading: false,
        dataSource: [
            {
                name: 'test',
                username: 'admin',
            },
        ],
    });

    function parseResponse(res: any) {
        try {
            return JSON.parse(res);
        } catch (err) {
            console.log('err', err);
            return null;
        }
    }

    function setParseResponse(res: any) {
        const dataSource = parseResponse(res);
        if (dataSource) {
            setState({ dataSource });
        }
    }

    function queryList() {
        invoke('query').then((res: any) => setParseResponse(res));
    }

    function saveValues(values: any) {
        return invoke('save', values).then((res: any) => setParseResponse(res));
    }

    useEffect(() => {
        if (window.__TAURI__) {
            queryList();
        }
    }, []);

    const handleAdd = () => {
        setState({ addModalOpen: true });
    };

    const handleAddOk = (values: any) => {
        // console.log(values);
        return saveValues(values).then(
            () => new Promise<void>((resolve) => setTimeout(resolve, 300))
        );
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
                            // loading
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
                            { title: 'Name', dataIndex: 'name', width: 120 },
                            {
                                title: 'Password',
                                dataIndex: 'password',
                                width: 240,
                                render: () => (
                                    <div className="flex space-x-3 items-center">
                                        <span className="block hover:text-primary-red text-lg tracking-tighter cursor-pointer leading-none">
                                            ﹡﹡﹡﹡﹡﹡
                                        </span>
                                        <i className="cursor-pointer hover-icon-primary">
                                            {eyeIcon}
                                        </i>
                                    </div>
                                ),
                            },
                            { title: 'URI', dataIndex: 'uri', width: 260 },
                            {
                                title: 'Username',
                                dataIndex: 'username',
                                width: 180,
                            },
                            {
                                title: 'Modified',
                                dataIndex: 'modified',
                                width: 200,
                            },
                        ]}
                        rowSelection={{}}
                        dataSource={state.dataSource}
                    />
                </main>
                <AddPassword
                    open={state.addModalOpen}
                    onClose={() => setState({ addModalOpen: false })}
                    onOk={handleAddOk}
                    okLoading={state.addSubmitLoading}
                />
            </div>
        </div>
    );
}
