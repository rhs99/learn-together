import { useState, MouseEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { KeyboardArrowDown } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Tooltip, Chip } from '@mui/material';

import './_index.scss';

type SortOptionsProps = {
  fetchSortedData: (options: any) => void;
};

const SortOptions = ({ fetchSortedData }: SortOptionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<string>('time');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchSortedData({ sortBy, sortOrder });
  }, [fetchSortedData, sortBy, sortOrder]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortByClick = (option: string) => {
    setSortBy(option);
    handleClose();
  };
  const handleSortOrderClick = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
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
      <Button onClick={handleClick} endIcon={<KeyboardArrowDown />}>
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
