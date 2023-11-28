import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

import './_index.scss';

type ModalProps = {
  isShown: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

const modalRoot = document.getElementById('modal-root');

const Modal = ({ isShown, onClose, title, children, footer }: ModalProps) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isShown || !modalRoot) {
    return null;
  }

  return createPortal(
    <div className="lt-Overlay" onClick={handleOverlayClick}>
      <div className="lt-Modal">
        {title && (
          <div className="modal-header">
            <h4>{title}</h4>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
