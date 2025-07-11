import TableRow, { type RowData } from './TableRow';

import './_table.scss';

type TableProps = {
  rowData: RowData[];
  onRowSelection?: (id: string) => void;
};

const Table = ({ rowData, onRowSelection }: TableProps) => {
  const tableBody = rowData.map((row, index) => {
    return <TableRow key={index} rowData={row} onRowSelection={onRowSelection} headerRow={index === 0} />;
  });

  return <div className="lt-Table">{tableBody}</div>;
};

export default Table;
