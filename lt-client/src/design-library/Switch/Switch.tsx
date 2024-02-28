import React from 'react';

import './_index.scss';

interface SwitchProps {
  isChecked: boolean;
  onChange: () => void;
}

const Switch = ({ isChecked, onChange }: SwitchProps) => {
  return (
    <div>
      <label className="lt-switch">
        <input type="checkbox" checked={isChecked} onChange={onChange} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default Switch;
