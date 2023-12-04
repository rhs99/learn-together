import React from 'react';
import Icon from '../Icon';

import './_index.scss';

interface SpinnerProps {
  isLoading: boolean;
}

const Spinner = ({ isLoading }: SpinnerProps) => {
  return (
    <div className={`lt-Loading-overlay ${isLoading ? 'visible' : ''}`}>
      <Icon name="spinner" className="spinner" size={48} />
    </div>
  );
};

export default Spinner;
