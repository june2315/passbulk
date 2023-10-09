import ActionBar from '../../components/ActionBar';
import Button, { ActiveButton } from '../../components/Button';
import ButtonGroup from '../../components/ButtonGroup';
import Dropdown from '../../components/Dropdown';
import Aside from '../../components/Aside';
import BreadCrumb from '../../components/BreadCrumb';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
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
import { isEqual } from 'lodash-es';

import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';

export default function Passwords() {
    const [state, setState]: any = useSetState({
        addModalOpen: false,
        deleteConfirmOpen: false,
        addSubmitLoading: false,
        deleteLoading: false,
        selectedRowKeys: [],
        dataSource: [
            {
                id: 1,
                name: 'test',
                username: 'admin',
            },
            {
                id: 2,
                name: 'test2',
                username: 'admin',
            },
        ],
    });

    function parseResponse(res: any) {
        try {
            return JSON.parse(res);
        } catch (err) {
            console.log('err', err);
            return Promise.reject(err);
        }
    }

    function setParseResponse(res: any) {
        const dataSource = parseResponse(res);
        console.log('dataSource', dataSource);

        if (dataSource) {
            setState({ dataSource });
        }
        return dataSource;
    }

    function queryList() {
        return invoke('query').then((res: any) => setParseResponse(res));
    }

    function saveValues(values: any) {
        return invoke('save', { data: JSON.stringify(values) })
            .then((res: any) => setParseResponse(res))
            .catch((err: any) => {
                console.log(err);
                return Promise.reject(err);
            });
    }

    function updateItem(record: any) {}

    function deleteItems(ids: string) {
        return invoke('batch_delete', { ids });
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

    const handleDelete = () => {
        setState({ deleteConfirmOpen: true });
    };

    const handleDeleteOk = () => {
        const { selectedRowKeys } = state;
        // console.log(selectedRowKeys);
        setState({ deleteLoading: true });
        deleteItems(selectedRowKeys.join(',')).then(() =>
            setTimeout(() => {
                queryList();
                setState({ deleteConfirmOpen: false, deleteLoading: false });
            }, 300)
        );
    };

    const handleRowChange = (selectedRowKeys: any[]) => {
        setState({ selectedRowKeys: Array.from(selectedRowKeys) });
    };

    /**
     * @param record
     * @param selected [是否已选中]
     */
    const handleRowSelect = (record: any, selected: boolean) => {
        let selectedRowKeys: any[] = [];
        if (state.selectedRowKeys.length > 1 || selected) {
            selectedRowKeys = [record.id];
        }
        setState({ selectedRowKeys });
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
                        <Button
                            key="copy"
                            icon={copyIcon}
                            disabled={state.selectedRowKeys.length !== 1}
                        >
                            copy
                        </Button>,
                        <Button
                            key="edit"
                            icon={editIcon}
                            disabled={state.selectedRowKeys.length !== 1}
                        >
                            edit
                        </Button>,
                        <Button
                            key="share"
                            icon={shareIcon}
                            disabled={state.selectedRowKeys.length < 1}
                        >
                            share
                        </Button>,
                        <Button
                            key="export"
                            icon={exportIcon}
                            disabled={state.selectedRowKeys.length < 1}
                        >
                            export
                        </Button>,
                        <Dropdown
                            key="more"
                            items={[{ label: 'Delete', onClick: handleDelete }]}
                            disabled={state.selectedRowKeys.length < 1}
                        >
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
                                        <span className="block hover:text-primary-red text-base font-bold tracking-tighter cursor-pointer leading-none">
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
                        rowSelection={{
                            selectedRowKeys: state.selectedRowKeys,
                            onChange: handleRowChange,
                            onSelect: handleRowSelect,
                        }}
                        contextMenu={{}}
                        dataSource={state.dataSource}
                    />
                </main>
                <AddPassword
                    open={state.addModalOpen}
                    onClose={() => setState({ addModalOpen: false })}
                    onOk={handleAddOk}
                    okLoading={state.addSubmitLoading}
                />

                <Modal
                    title="Delete password?"
                    okText="delete"
                    top={20}
                    open={state.deleteConfirmOpen}
                    onClose={() => setState({ deleteConfirmOpen: false })}
                    okButtonProps={{
                        danger: true,
                        loading: state.deleteLoading,
                    }}
                    onOk={handleDeleteOk}
                >
                    <p className="text-base">
                        Are you sure you want to delete the password test?
                    </p>
                    <br />
                    <p className="text-base">
                        Once the password is deleted, it’ll be removed
                        permanently and will not be recoverable.
                    </p>
                    <br />
                </Modal>
            </div>
        </div>
    );
}
