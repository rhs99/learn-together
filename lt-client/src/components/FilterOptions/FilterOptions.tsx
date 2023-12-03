import { useState, useEffect, useRef } from 'react';
import Button from '../../design-library/Button/Button';
import Icon from '../../design-library/Icon';
import Dropdown from '../../design-library/Dropdown/Dropdown';
import Tooltip from '../../design-library/Tooltip/Tooltip';

import './_index.scss';

type FilterOptionsProps = {
  filterBy: string;
  handleFilterOptionsChange: (value: string) => void;
  fetchSortedData: () => void;
};

const FilterOptions = ({ filterBy, handleFilterOptionsChange, fetchSortedData }: FilterOptionsProps) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const anchorEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchSortedData();
  }, [fetchSortedData, filterBy]);

  const handleFilterByClick = (value: string) => {
    handleFilterOptionsChange(value);
    setShowFilterPanel(false);
  };

  const getName = (val: string) => {
    switch (val) {
      case 'all':
        return 'All';
      case 'favourite':
        return 'Favourites';
      case 'mine':
        return 'Asked by me';
    }
  };

  return (
    <div className="cl-FilterOptions">
      <div ref={anchorEl}>
        <Button variant="secondary" onClick={() => setShowFilterPanel((prev) => !prev)}>
          Filter By
        </Button>
      </div>
      <span className="filterBy">{getName(filterBy)}</span>
      <Dropdown
        options={[
          { label: 'All', value: 'all' },
          { label: 'Favourites', value: 'favourite' },
          { label: 'Asked by me', value: 'mine' },
        ]}
        anchorElement={anchorEl?.current}
        isShown={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onSelect={handleFilterByClick}
        shift={40}
      />
    </div>
  );
};

export default FilterOptions;