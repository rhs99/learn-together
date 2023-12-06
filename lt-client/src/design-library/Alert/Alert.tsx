import './_index.scss';

type AlertProps = {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  handleClose: () => void;
  isShown: boolean;
};

const Alert = ({ type, message, handleClose, isShown }: AlertProps) => {
  if (!isShown) {
    return null;
  }
  return (
    <div className={`lt-Alert lt-Alert-${type}`}>
      {message}
      <span className="lt-Alert-close-btn" onClick={handleClose}>
        &times;
      </span>
    </div>
  );
};

export default Alert;
