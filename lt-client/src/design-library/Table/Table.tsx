import TableRow from './TableRow';

import './_table.scss';

type TableProps = {
  rowData: any;
  onRowSelection?: (data: any) => void;
};

const Table = ({ rowData, onRowSelection }: TableProps) => {
  const tableBody = rowData.map((row: any, index: number) => {
    const props: any = {};
    if (index !== 0) {
      props.onRowSelection = onRowSelection;
    }
    return <TableRow key={index} rowData={row} {...props} headerRow={index === 0} />;
  });

  return <div className="lt-Table">{tableBody}</div>;
};

export default Table;
