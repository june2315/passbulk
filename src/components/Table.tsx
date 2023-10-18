import { useSetState } from 'ahooks';
import Checkbox from './Checkbox';
import { useEffect } from 'react';
import { isEqual } from 'lodash-es';
import classNames from 'classnames';

export default function Table(props: any) {
    const { rowSelection, contextMenu, columns = [], dataSource = [] } = props;

    const [state, setState] = useSetState({
        selectedRowKeys: props.selectedRowKeys || [],
    });

    const getRowKey = (record: any, index?: number) =>
        record.key || record.id || `row_${index}`;

    useEffect(() => {
        if (
            Array.isArray(rowSelection?.selectedRowKeys) &&
            !isEqual(rowSelection?.selectedRowKeys, state.selectedRowKeys)
        ) {
            setState({ selectedRowKeys: rowSelection?.selectedRowKeys });
        }
    }, [rowSelection?.selectedRowKeys]);

    const handleContextMenu = (event: any) => {
        if (contextMenu) {
            event.preventDefault();
        }
    };

    const handleChecked = (checked: boolean, record: any) => {
        let { selectedRowKeys } = state;
        if (checked) {
            selectedRowKeys = [...state.selectedRowKeys, getRowKey(record)];
        } else {
            selectedRowKeys = state.selectedRowKeys.filter(
                (id: any) => id !== record.id
            );
        }
        setState({
            selectedRowKeys,
        });

        rowSelection?.onChange?.(selectedRowKeys);
    };

    const handleCheckAll = (checked: boolean) => {
        let { selectedRowKeys } = state;
        if (checked) {
            selectedRowKeys = dataSource.map((item: any) => getRowKey(item));
        } else {
            selectedRowKeys = [];
        }
        setState({
            selectedRowKeys,
        });

        rowSelection?.onChange?.(selectedRowKeys);
    };

    const handleRowClick = (record: any, checked: boolean) => {
        const { onSelect } = rowSelection || {};
        onSelect?.(record, !checked);
    };

    const isCheckedAll = () => {
        return (
            state.selectedRowKeys.length === dataSource.length &&
            dataSource.length
        );
    };

    const isIndeterminate = () => {
        return (
            state.selectedRowKeys.length > 0 &&
            state.selectedRowKeys.length < dataSource.length
        );
    };

    return (
        <div className="w-full">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 dark:bg-neutral-900 dark:text-white">
                <thead className="bg-gray-50 dark:bg-[#3B3B3B] dark:text-white">
                    <tr className="font-semibold">
                        {rowSelection ? (
                            <th
                                scope="col"
                                className="px-4 py-4 "
                                style={{ width: 30 }}
                            >
                                <Checkbox
                                    disabled={!dataSource.length}
                                    indeterminate={isIndeterminate()}
                                    checked={isCheckedAll()}
                                    onChange={(checked: boolean) =>
                                        handleCheckAll(checked)
                                    }
                                />
                            </th>
                        ) : null}
                        {columns.map?.((col: any, colIndex: number) => (
                            <th
                                scope="col"
                                className="px-4 py-4 cursor-default"
                                key={col.dataIndex || `col_${colIndex}`}
                                style={{ width: col.width || 'auto' }}
                            >
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="border-t border-neutral-950">
                    {dataSource.map?.((record: any, index: number) => {
                        const rowKey = getRowKey(record, index);
                        const checked = state.selectedRowKeys.includes(rowKey);
                        return (
                            <tr
                                className={classNames('hover:bg-neutral-950', {
                                    ['bg-neutral-950']: checked,
                                })}
                                key={rowKey}
                                onContextMenu={handleContextMenu}
                                onClick={() => handleRowClick(record, checked)}
                            >
                                {rowSelection ? (
                                    <td
                                        onClick={(e: any) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        <Checkbox
                                            checked={checked}
                                            onChange={(checked: boolean) =>
                                                handleChecked(checked, record)
                                            }
                                        />
                                    </td>
                                ) : null}
                                {columns.map?.((col: any, colIndex: number) => {
                                    const cellKey = `${rowKey}_${colIndex}`;
                                    const text = record[col.dataIndex];
                                    return (
                                        <td className="px-4 py-3" key={cellKey}>
                                            {col.render
                                                ? col.render?.(
                                                      text,
                                                      record,
                                                      index
                                                  )
                                                : text || null}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    {!dataSource.length ? (
                        <tr>
                            <td
                                className="p-4 text-center capitalize leading-[200px] text-neutral-600 text-lg"
                                colSpan={
                                    columns.length + (rowSelection ? 1 : 0)
                                }
                            >
                                no items
                            </td>
                        </tr>
                    ) : null}
                </tbody>
            </table>
        </div>
    );
}
