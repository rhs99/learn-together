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
        className={`container ${headerRow ? '' : 'clickable'}`}
      >
        {rowData.value.map((col: any, index: number) => (
          <div key={index} className={`${headerRow ? 'header-cell' : ''}`}>
            {col}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableRow;
