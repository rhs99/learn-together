import { ReactNode, ButtonHTMLAttributes } from 'react';

import './_index.scss';

type ButtonType = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonType;
  disabled?: boolean;
}

const Button = ({ children, variant = 'primary', disabled = false, ...rest }: ButtonProps) => {
  const buttonClassName = `lt-Button lt-Button-${variant} lt-Button-${disabled ? 'disabled' : ''}`;

  return (
    <button className={buttonClassName} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
