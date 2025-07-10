import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Table from './Table';

describe('Table Component', () => {
  const mockRowData = [
    { value: ['Header 1', 'Header 2', 'Header 3'] },
    { value: ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'], options: { _id: '1' } },
    { value: ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'], options: { _id: '2' } },
  ];

  test('renders table with correct data', () => {
    render(<Table rowData={mockRowData} />);

    // Check if headers are rendered
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Header 2')).toBeInTheDocument();
    expect(screen.getByText('Header 3')).toBeInTheDocument();

    // Check if data rows are rendered
    expect(screen.getByText('Row 1 Col 1')).toBeInTheDocument();
    expect(screen.getByText('Row 1 Col 2')).toBeInTheDocument();
    expect(screen.getByText('Row 1 Col 3')).toBeInTheDocument();
    expect(screen.getByText('Row 2 Col 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2 Col 2')).toBeInTheDocument();
    expect(screen.getByText('Row 2 Col 3')).toBeInTheDocument();
  });

  test('calls onRowSelection when a row is clicked', async () => {
    const mockOnRowSelection = vi.fn();
    const user = userEvent.setup();

    render(<Table rowData={mockRowData} onRowSelection={mockOnRowSelection} />);

    // Find and click on the first data row
    const firstRow = screen.getByText('Row 1 Col 1').closest('.lt-TableRow-container');
    if (firstRow) {
      await user.click(firstRow);
      expect(mockOnRowSelection).toHaveBeenCalledWith('1');
    }
  });
});
