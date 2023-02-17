import React, { useState } from 'react';
import { Box } from '../../../components/Box/Box';
import { CloseButton } from '../../../components/CloseButton/CloseButton';
import { Dialog } from '../../../components/Dialog/Dialog';
import { DialogContent } from '../../../components/Dialog/DialogContent';
import { Text } from '../../../components/Text/Text';
import { isMobile } from '../../../utils/isMobile';

import { AKButton } from '../AKButton';
import { AKInput } from '../AKInput';

export enum UserDetailsModalCloseResolution {
  USER_CANCEL,
  SUCCESS,
  ERROR,
}

export interface IUserData {
  name: string;
  email: string;
}

export interface UserDetailsModalProps {
  open: boolean;
  onClose: (resolution: UserDetailsModalCloseResolution) => void;
  onSubmit: (data: { name: string; email: string }) => any;
}

export function UserDetailsModal({
  onClose,
  onSubmit,
  open,
}: UserDetailsModalProps) {
  const titleId = 'ak_user_details_title';
  const [isLoading, setIsLoading] = useState(false);

  const mobile = isMobile();

  const onSubmitLocalHandle: React.FormEventHandler<HTMLFormElement> = async (
    event: any
  ) => {
    const name = event.target.name.value;
    const email = event.target.email.value;

    event.preventDefault();

    setIsLoading(true);
    await onSubmit({ email, name })
      .then(() => onClose(UserDetailsModalCloseResolution.SUCCESS))
      .catch(() => {
        onClose(UserDetailsModalCloseResolution.ERROR);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog
      onClose={() => {
        onClose(UserDetailsModalCloseResolution.ERROR);
      }}
      open={open}
      titleId={titleId}
    >
      <DialogContent bottomSheetOnMobile padding="0" wide>
        <>
          <Box display="flex" flexDirection="column">
            <Box background="profileForeground" padding="16">
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                gap={mobile ? '16' : '12'}
                justifyContent="center"
                margin="8"
                style={{ textAlign: 'center' }}
              >
                <Box
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    willChange: 'transform',
                  }}
                >
                  <CloseButton
                    onClose={() => {
                      setIsLoading(true);
                      onClose(UserDetailsModalCloseResolution.USER_CANCEL);
                    }}
                  />
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={mobile ? '4' : '0'}
                    justifyContent="center"
                    marginLeft="20"
                    textAlign="center"
                  >
                    <Text
                      as="h1"
                      color="modalText"
                      id={titleId}
                      size={mobile ? '20' : '18'}
                      textAlign="center"
                      weight="heavy"
                    >
                      More about you
                    </Text>
                  </Box>
                </Box>
              </Box>
              <Box
                background="generalBorder"
                height="1"
                marginY="10"
                width="full"
              />
              <Box
                color="modalText"
                fontWeight="bold"
                margin="2"
                marginTop="16"
                textAlign="left"
              >
                We need bit of information to get started
              </Box>
              <Box
                as="form"
                display="flex"
                flexDirection="column"
                gap="4"
                marginTop="16"
                onSubmit={onSubmitLocalHandle}
              >
                <AKInput label="Name" name="name" placeholder="Your Name" />
                <AKInput
                  label="Email"
                  name="email"
                  placeholder="example@email.com"
                  type="email"
                />
                <Box paddingTop="24">
                  <AKButton disabled={isLoading} fullWidth type="submit">
                    {isLoading ? 'Loading...' : 'Complete'}
                  </AKButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      </DialogContent>
    </Dialog>
  );
}
