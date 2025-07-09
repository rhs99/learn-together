import { useEffect } from 'react';

import {
  Button,
  Tooltip,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Flex,
} from '@optiaxiom/react';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';

type SortOptionsProps = {
  sortBy: string;
  sortOrder: string;
  handleSortOptionsChange: (option: string, val: string) => void;
  fetchSortedData: () => void;
};

const SortOptions = ({ sortBy, sortOrder, handleSortOptionsChange, fetchSortedData }: SortOptionsProps) => {
  useEffect(() => {
    fetchSortedData();
  }, [fetchSortedData, sortBy, sortOrder]);

  const handleSortByClick = (value: string) => {
    handleSortOptionsChange('sortBy', value);
  };

  const handleSortOrderClick = () => {
    const val = sortOrder === 'desc' ? 'asc' : 'desc';
    handleSortOptionsChange('sortOrder', val);
  };

  const getName = (val: string) => {
    switch (val) {
      case 'vote':
        return 'Vote';
      case 'upVote':
        return 'Up Vote';
      case 'downVote':
        return 'Down Vote';
      case 'time':
        return 'Time';
    }
  };

  return (
    <Flex flexDirection="row" gap="4">
      <DropdownMenu>
        <DropdownMenuTrigger>{getName(sortBy)}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleSortByClick('vote')}>Vote</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortByClick('upVote')}>Up Vote</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortByClick('downVote')}>Down Vote</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortByClick('time')}>Time</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip content={sortOrder}>
        <Button
          aria-label="Sort Order"
          appearance="subtle"
          onClick={handleSortOrderClick}
          icon={sortOrder === 'desc' ? <GoArrowDown /> : <GoArrowUp />}
        />
      </Tooltip>
    </Flex>
  );
};

export default SortOptions;
