import { useState } from 'react';

import './_index.scss';

export type AlertProps = {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
};

const Alert = ({ type, message }: AlertProps) => {
  const [isClosed, setIsClosed] = useState(false);

  const handleClose = () => {
    setIsClosed(true);
  };

  return (
    <>
      {!isClosed && (
        <div className={`lt-Alert lt-Alert-${type}`}>
          {message}
          <span className="lt-Alert-close-btn" onClick={handleClose}>
            &times;
          </span>
        </div>
      )}
    </>
  );
};

export default Alert;
