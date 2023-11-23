import { useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

type TableProps = {
  rowData: any;
  columnDefs: any;
  className?: string;
  onRowSelection?: (data: any) => void;
};

const Table = ({ rowData, columnDefs, className = '', onRowSelection }: TableProps) => {
  const gridRef = useRef<any>();

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef?.current?.api.getSelectedRows();
    onRowSelection?.(selectedRows[0]);
  }, [onRowSelection]);

  return (
    <div className={`ag-theme-alpine ${className}`}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout={'autoHeight'}
        rowSelection="single"
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
};

export default Table;
