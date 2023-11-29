import { useState } from 'react';

import './_index.scss';

type AlertProps = {
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
        <div className={`alert ${type}`}>
          {message}
          <span className="close-alert" onClick={handleClose}>
            &times;
          </span>
        </div>
      )}
    </>
  );
};

export default Alert;
