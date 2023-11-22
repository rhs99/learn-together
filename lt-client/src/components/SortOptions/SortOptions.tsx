import { useState, MouseEvent, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Tooltip, Chip } from '@mui/material';
import Button from '../../design-library/Button';

import './_index.scss';

type SortOptionsProps = {
  sortBy: string;
  sortOrder: string;
  handleSortOptionsChange: (option: string, val: string) => void;
  fetchSortedData: () => void;
};

const SortOptions = ({ sortBy, sortOrder, handleSortOptionsChange, fetchSortedData }: SortOptionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchSortedData();
  }, [fetchSortedData, sortBy, sortOrder]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortByClick = (option: string) => {
    handleSortOptionsChange('sortBy', option);
    handleClose();
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
    <div className="cl-SortOptions">
      <Button onClick={handleClick}>
        Sort By
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleSortByClick('vote')}>Vote</MenuItem>
        <MenuItem onClick={() => handleSortByClick('upVote')}>Up Vote</MenuItem>
        <MenuItem onClick={() => handleSortByClick('downVote')}>Down Vote</MenuItem>
        <MenuItem onClick={() => handleSortByClick('time')}>Time</MenuItem>
      </Menu>
      <Chip variant="outlined" label={getName(sortBy)} size="small" className="chip" />
      <Tooltip title={sortOrder}>
        <IconButton onClick={handleSortOrderClick} color="primary">
          {sortOrder === 'desc' ? <ArrowDownwardIcon fontSize="medium" /> : <ArrowUpwardIcon fontSize="medium" />}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default SortOptions;
