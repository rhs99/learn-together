import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@optiaxiom/react';
import type { ReactNode } from 'react';
type ConfirmationModalProps = {
  action: string;
  actionDisabled?: boolean;
  appearance?: 'danger-outline' | 'danger' | 'default' | 'inverse' | 'primary' | 'subtle';
  cancelDisabled?: boolean;
  cancelLabel?: string;
  children?: ReactNode;
  className?: string;
  confirmLoading?: boolean;
  isShown?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
};

function ConfirmationModal({
  title,
  children,
  onCancel,
  onConfirm,
  cancelLabel = 'Cancel',
  action,
  actionDisabled,
  confirmLoading,
  isShown,
  appearance = 'primary',
  cancelDisabled,
}: ConfirmationModalProps) {
  return (
    <AlertDialog open={isShown}>
      <AlertDialogContent onEscapeKeyDown={onCancel}>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogBody>{children}</AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelDisabled} onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            appearance={appearance}
            disabled={actionDisabled}
            loading={confirmLoading}
            onClick={onConfirm}
          >
            {action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmationModal;
