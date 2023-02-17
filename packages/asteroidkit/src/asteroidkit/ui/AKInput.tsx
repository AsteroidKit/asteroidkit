import React, { FC, InputHTMLAttributes } from 'react';
import { Box } from '../../components/Box/Box';
import { isMobile } from '../isMobileUtil';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const AKInput: FC<InputProps> = ({
  autoComplete = 'off',
  label,
  name,
  placeholder,
  type,
}) => {
  const mobile = isMobile();

  return (
    <Box color="modalText" display="flex" flexDirection="column">
      <Box as="label" fontSize="14" fontWeight="medium" paddingY="4">
        {label}
      </Box>
      <Box
        as="input"
        autoComplete={autoComplete}
        background={{
          base: 'profileAction',
          ...(!mobile ? { hover: 'profileActionHover' } : {}),
        }}
        color="modalText"
        name={name}
        padding="14"
        placeholder={placeholder}
        type={type}
      />
    </Box>
  );
};
