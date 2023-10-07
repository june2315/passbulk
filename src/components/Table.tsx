import Checkbox from './Checkbox';
export default function Table(props: any) {
    const { rowSelection, columns = [], dataSource = [] } = props;

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
                                <Checkbox />
                            </th>
                        ) : null}
                        {columns.map?.((col: any, colIndex: number) => (
                            <th
                                scope="col"
                                className="px-6 py-4 "
                                key={col.dataIndex || `col_${colIndex}`}
                                style={{ width: col.width || 'auto' }}
                            >
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className=" border-t border-neutral-950">
                    {dataSource.map?.((record: any, index: number) => {
                        const rowKey =
                            record.key || record.id || `row_${index}`;

                        return (
                            <tr className="hover:bg-neutral-950" key={rowKey}>
                                {rowSelection ? (
                                    <td>
                                        <Checkbox />
                                    </td>
                                ) : null}
                                {columns.map?.((col: any, colIndex: number) => {
                                    const cellKey = `${rowKey}_${colIndex}`;
                                    const text = record[col.dataIndex];
                                    return (
                                        <td className="px-6 py-4" key={cellKey}>
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
                </tbody>
            </table>
        </div>
    );
}
