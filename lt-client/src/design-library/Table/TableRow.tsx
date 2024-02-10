import './_table-row.scss';

type TableRowProps = {
  rowData: any;
  onRowSelection?: (data: any) => void;
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
        {rowData.value.map((col: any, index: number) => (
          <div key={index} className={`${headerRow ? 'lt-TableRow-headerCell' : ''}`}>
            {col}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableRow;
