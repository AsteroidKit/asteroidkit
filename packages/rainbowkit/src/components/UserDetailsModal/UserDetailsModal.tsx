import React from 'react';
import { Dialog } from '../Dialog/Dialog';
import { DialogContent } from '../Dialog/DialogContent';
export interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

export function UserDetailsModal({ onClose, open }: UserDetailsModalProps) {
  const titleId = 'ak_user_details_title';
  // const connectionStatus = useConnectionStatus();

  return (
    <Dialog onClose={onClose} open={open} titleId={titleId}>
      <DialogContent bottomSheetOnMobile padding="0" wide>
        {/* <<ConnectOptions onClose={onClose} />> */}
        <div>Something</div>
      </DialogContent>
    </Dialog>
  );
}
