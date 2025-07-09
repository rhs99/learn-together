import { useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@optiaxiom/react';
import { CiFilter } from 'react-icons/ci';

type FilterOptionsProps = {
  filterBy: string;
  handleFilterOptionsChange: (value: string) => void;
  fetchSortedData: () => void;
  disabled: boolean;
};

const FilterOptions = ({ filterBy, handleFilterOptionsChange, fetchSortedData, disabled }: FilterOptionsProps) => {
  useEffect(() => {
    fetchSortedData();
  }, [fetchSortedData, filterBy]);

  const handleFilterByClick = (value: string) => {
    handleFilterOptionsChange(value);
  };

  const getName = (val: string) => {
    switch (val) {
      case 'all':
        return 'All';
      case 'favourite':
        return 'Favourites';
      case 'mine':
        return 'Asked by me';
      default:
        return 'All';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled}>{getName(filterBy)}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleFilterByClick('all')}>All</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilterByClick('favourite')}>Favourites</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilterByClick('mine')}>Asked by me</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterOptions;
