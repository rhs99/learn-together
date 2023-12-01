import { ReactNode, ButtonHTMLAttributes } from 'react';

import './_index.scss';

type ButtonType = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonType;
}

const Button = ({ children, variant = 'primary', ...rest }: ButtonProps) => {
  const buttonClassName = `lt-Button lt-Button-${variant}`;

  return (
    <button className={buttonClassName} {...rest}>
      {children}
    </button>
  );
};

export default Button;
