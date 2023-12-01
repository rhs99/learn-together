import { useState, useEffect, useRef } from 'react';
import Button from '../../design-library/Button/Button';
import Icon from '../../design-library/Icon';
import Dropdown from '../../design-library/Dropdown/Dropdown';

import './_index.scss';

type SortOptionsProps = {
  sortBy: string;
  sortOrder: string;
  handleSortOptionsChange: (option: string, val: string) => void;
  fetchSortedData: () => void;
};

const SortOptions = ({ sortBy, sortOrder, handleSortOptionsChange, fetchSortedData }: SortOptionsProps) => {
  const [showSortby, setShowSortby] = useState(false);
  const anchorEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchSortedData();
  }, [fetchSortedData, sortBy, sortOrder]);

  const handleSortByClick = (value: string) => {
    handleSortOptionsChange('sortBy', value);
    setShowSortby(false);
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
      <div ref={anchorEl}>
        <Button variant="secondary" onClick={() => setShowSortby((prev) => !prev)}>
          Sort By
        </Button>
      </div>
      <Dropdown
        anchorElement={anchorEl?.current}
        options={[
          { label: 'Vote', value: 'vote' },
          { label: 'Up Vote', value: 'upVote' },
          { label: 'Down Vote', value: 'downVote' },
          { label: 'Time', value: 'time' },
        ]}
        onSelect={handleSortByClick}
        isShown={showSortby}
        onClose={() => setShowSortby(false)}
      />
      <span className="sortBy">{getName(sortBy)}</span>
      <Icon
        onClick={handleSortOrderClick}
        name={sortOrder === 'desc' ? 'arrow-down-line' : 'arrow-up-line'}
        size={18}
      />
    </div>
  );
};

export default SortOptions;
