import { ITableProps } from '@/types/custom-table.types';

const CustomTable = <T extends object>({ columns, data }: ITableProps<T>) => {
  return (
    <div className="border border-white/[0.09] bg-[rgba(6,28,38,0.55)] backdrop-blur-xl custom-scrollbar overflow-x-auto rounded-2xl p-0 shadow-[0_8px_32px_0_rgba(0,0,0,0.35)]">
      <table className="divide-y divide-white/[0.08] min-w-full">
        <thead>
          <tr className="bg-white/[0.03]">
            {columns?.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="text-primary-text/90 px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-nowrap uppercase"
              >
                {column?.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="transition-colors duration-150 hover:bg-white/[0.04]"
            >
              {columns?.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="text-secondary-text px-6 py-4 text-sm whitespace-nowrap"
                >
                  {'accessor' in column && column?.accessor
                    ? String(row[column?.accessor] ?? '')
                    : column?.cell?.(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
