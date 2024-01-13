import ActionBar from '@/components/ActionBar';
import Button, { ActiveButton } from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup';
import Dropdown from '@/components/Dropdown';
import Aside from '@/components/Aside';
import BreadCrumb from '@/components/BreadCrumb';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Message from '@/components/Message/Message';
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
  eyeOff,
  sortDESC,
  sortASC,
} from '@/components/Icons';
import AddPassword from './AddPassword';
import PasswordDetail from './Detail';
import { copyPassword, deletePasswords, savePassword, queryPasswordList } from '@/api';

import { useSetState, useUpdateEffect } from 'ahooks';
// import { isEqual } from 'lodash-es';
import { RefObject, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
// import classNames from 'classnames';
import type { PageState } from '@/interface';
import classNames from 'classnames';
import { log } from 'console';

export default function Passwords() {
  const [pageState] = useOutletContext<PageState[]>();
  const queryParamsRef: RefObject<any> = useRef({});

  const [state, setState]: any = useSetState({
    addModalOpen: false,
    deleteConfirmOpen: false,
    addSubmitLoading: false,
    deleteLoading: false,
    selectedRowKeys: [],
    selectedDetail: null,
    passwordMap: {},
    sortOrder: 'DESC',
    infoActive: false,
    dataSource: [
      // {
      //     id: 1,
      //     name: 'test',
      //     username: 'admin',
      //     password: '123',
      // },
      // {
      //     id: 2,
      //     name: 'test2',
      //     username: 'admin',
      //     password: 'abc',
      // },
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

  function queryList(query_params = {}) {
    return queryPasswordList({
      ...queryParamsRef.current,
      ...query_params,
    }).then((res: any) => setParseResponse(res));
  }

  useEffect(() => {
    if (window.__TAURI__) {
      queryList();
    }
  }, []);

  useUpdateEffect(() => {
    // console.log('searchValue', pageState.searchValue);
    queryParamsRef.current['name'] = pageState.searchValue;
    queryList();
  }, [pageState.searchValue]);

  const handleToggleSort = () => {
    const sortOrder = state.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setState({ sortOrder });
    queryParamsRef.current['order_by'] = sortOrder;
    queryList();
  };

  const handleAdd = () => {
    setState({ addModalOpen: true, editItem: null });
  };

  const handleAddOk = (values: any) => {
    // console.log(values);
    return savePassword(values)
      .then(
        () =>
          new Promise<void>((resolve) => {
            queryList();
            setTimeout(resolve, 300);
          })
      )
      .catch((error) => {
        Message.error(error);
        return Promise.reject(error);
      });
  };

  const handleEdit = () => {
    const { dataSource, selectedRowKeys } = state;
    const editItem = dataSource.find((d: any) => d.id === selectedRowKeys[0]);
    if (editItem) {
      setState({ addModalOpen: true, editItem });
    }
  };

  const handleDelete = () => {
    setState({ deleteConfirmOpen: true });
  };

  const handleDeleteOk = () => {
    const { selectedRowKeys } = state;
    // console.log(selectedRowKeys);
    setState({ deleteLoading: true });
    deletePasswords(selectedRowKeys.join(',')).then(() =>
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
      setState({ selectedDetail: record });
    } else {
      setState({ selectedDetail: null });
    }
    setState({ selectedRowKeys });
  };

  const handleCopyPassword = () => {
    // // TODO delete
    // Message.success('已复制到剪切板');
    const record = state.dataSource.find((d: any) => state.selectedRowKeys.includes(d.id));

    if (!record) return;
    copyPassword(record.id, state.passwordMap[record.id]).then(() => {
      Message.success('已复制到剪切板');
    });
  };

  const handleCopyRecord = (record) => {
    copyPassword(record.id, state.passwordMap[record.id]).then(() => {
      Message.success('已复制到剪切板');
    });
  };

  const handleShowPassword = (record: any) => {
    let { passwordMap } = state;

    passwordMap[record.id] = passwordMap[record.id] ? null : record.password;

    // console.log(passwordMap);
    setState({ passwordMap });
  };

  const handleInfoChange = (infoActive: boolean) => {
    setState({ infoActive });
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
        extra={{
          right: [
            <ButtonGroup key="extraRightBtn">
              <Dropdown icon={columnIcon} />
              <ActiveButton key="info" icon={infoIcon} active={state.infoActive} onChange={handleInfoChange} />
            </ButtonGroup>,
          ],
        }}
      >
        <ButtonGroup>
          {[
            <Button
              key="copy"
              icon={copyIcon}
              disabled={state.selectedRowKeys.length !== 1}
              onClick={handleCopyPassword}
            >
              copy
            </Button>,
            <Button
              key="edit"
              icon={editIcon}
              disabled={state.selectedRowKeys.length !== 1}
              onClick={handleEdit}
            >
              edit
            </Button>,
            <Button key="share" icon={shareIcon} disabled={state.selectedRowKeys.length < 1}>
              share
            </Button>,
            <Button key="export" icon={exportIcon} disabled={state.selectedRowKeys.length < 1}>
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
        <main className="flex-1 relative overflow-y-hidden h-[calc(100vh-178px)]">
          <BreadCrumb />

          <Table
            columns={[
              { title: 'Name', dataIndex: 'name', width: 200 },
              {
                title: 'Password',
                dataIndex: 'password',
                width: 200,
                render: (text: any, record: any) => {
                  const showPassword = state.passwordMap[record.id];
                  return (
                    <div
                      className="group flex space-x-3 items-center min-h-[22px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        onClick={() => handleCopyRecord(record)}
                        className="text-base leading-none "
                      >
                        {showPassword ? (
                          <span className="inline-block pointer-events-none">{text}</span>
                        ) : (
                          <span className="inline-block hover:text-primary-red font-bold tracking-tighter cursor-pointer">
                            ﹡﹡﹡﹡﹡﹡
                          </span>
                        )}
                      </div>

                      <i
                        className="cursor-pointer hover-icon-primary hidden group-hover:inline-block"
                        onClick={() => handleShowPassword(record)}
                      >
                        {showPassword ? eyeOff : eyeIcon}
                      </i>
                    </div>
                  );
                },
              },
              { title: 'URI', dataIndex: 'uri', width: 200 },
              {
                title: 'Username',
                dataIndex: 'username',
                width: 180,
              },
              {
                title: (
                  <div
                    className={classNames('cursor-pointer flex space-x-2 items-center')}
                    onClick={handleToggleSort}
                  >
                    <span>Modified</span>
                    {state.sortOrder === 'DESC' ? sortDESC : sortASC}
                  </div>
                ),
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
            // dataSource={[]}
          />

          <PasswordDetail
            open={state.selectedDetail && state.infoActive}
            onClose={() => setState({ infoActive: false })}
            data={state.selectedDetail}
          />
        </main>

        <AddPassword
          data={state.editItem}
          open={state.addModalOpen}
          onClose={() => setState({ addModalOpen: false })}
          onOk={handleAddOk}
          okLoading={state.addSubmitLoading}
        />

        <Modal
          title="Delete password?"
          okText="delete"
          top={20}
          okButtonProps={{
            danger: true,
            loading: state.deleteLoading,
          }}
          open={state.deleteConfirmOpen}
          onClose={() => setState({ deleteConfirmOpen: false })}
          onOk={handleDeleteOk}
        >
          <p className="text-base">Are you sure you want to delete the password test?</p>
          <br />
          <p className="text-base">
            Once the password is deleted, it’ll be removed permanently and will not be recoverable.
          </p>
          <br />
        </Modal>
      </div>
    </div>
  );
}
