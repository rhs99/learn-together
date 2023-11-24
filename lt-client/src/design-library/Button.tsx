import React from 'react';

import Icon from './Icon';

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  icon?: string;
  size?: number;
};

const Button = ({ children, onClick, className = '', disabled = false, icon = '', size = 12 }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className} style={{ cursor: 'pointer' }}>
      {icon && <Icon name={icon} size={size} />}
      {!icon && children}
    </button>
  );
};

export default Button;
