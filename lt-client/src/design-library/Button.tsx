import React from 'react';

import Icon from './Icon';

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
};

const Button = ({ children, onClick, className = '', disabled = false }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className} style={{ cursor: 'pointer' }}>
      {children}
    </button>
  );
};

export default Button;
