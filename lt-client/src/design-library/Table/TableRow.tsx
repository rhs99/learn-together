import './_table-row.scss';

export type RowData = {
  value: string[];
  options?: {
    _id?: string;
  };
};

type TableRowProps = {
  rowData: RowData;
  onRowSelection?: (id: string) => void;
  headerRow?: boolean;
};

const TableRow = ({ rowData, onRowSelection, headerRow }: TableRowProps) => {
  return (
    <div className="lt-TableRow">
      <div
        onClick={() => {
          if (rowData.options?._id) {
            onRowSelection?.(rowData.options._id);
          }
        }}
        className={`lt-TableRow-container ${headerRow ? '' : onRowSelection ? 'lt-TableRow-clickable' : ''}`}
      >
        {rowData.value.map((col, index) => (
          <div key={index} className={`${headerRow ? 'lt-TableRow-headerCell' : ''}`}>
            {col}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableRow;
