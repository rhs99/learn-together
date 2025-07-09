import { toaster } from '@optiaxiom/react';
import { useCallback } from 'react';

export type AlertType = 'danger' | 'information' | 'neutral' | 'success' | 'warning';

function useAlert() {
  const createToast = useCallback(
    (message: string, type: AlertType, action?: string, onAction?: () => Promise<void>) => {
      const toastId = toaster.create(message, { type, action, onAction });
      return () => toaster.remove(toastId);
    },
    []
  );

  return createToast;
}

export default useAlert;
