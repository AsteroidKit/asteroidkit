import React, { FC, InputHTMLAttributes } from 'react';
import { Box } from '../../components/Box/Box';
import { isMobile } from '../isMobileUtil';

export interface ButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
  // label: string;
  // name: string;
  fullWidth?: boolean;
}

export const AKButton: FC<ButtonProps> = ({
  autoComplete = 'off',
  children,
  disabled,
  fullWidth,
  name,
  placeholder,
  type,
}) => {
  const mobile = isMobile();

  return (
    <Box
      as="button"
      background={{
        base: 'profileAction',
        ...(!mobile && !disabled ? { hover: 'profileActionHover' } : {}),
      }}
      display="flex"
      justifyContent="center"
      {...(disabled ? { cursor: 'not-allowed' } : {})}
      autoComplete={autoComplete}
      children={children}
      color="modalText"
      disabled={disabled}
      fontWeight="heavy"
      name={name}
      padding="14"
      placeholder={placeholder}
      type={type}
      width={fullWidth ? 'full' : undefined}
    />
  );
};
