import React from 'react';
import { Theme } from '@mui/material';

export const getDefaultStyles = (theme: Theme): { [key: string]: React.CSSProperties} => {
  const buttonStyleDefaults: React.CSSProperties = {
    borderRadius: 0,
    background: 'transparent',
    color: 'inherit',
    border: 'none',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  };

  const containerStyleDefaults: React.CSSProperties = {
    margin: 0,
  };

  const dropdownStyleDefaults: React.CSSProperties = {
    color: `${theme.palette.primary.main}`,
    position: 'fixed'
  };

  const inputStyleDefaults: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    height: '1.4375em',
    border: 'none',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 0,
    resize: 'vertical',
    background: 'transparent',
    color: 'inherit',
    fontSize: '16px',
    padding: '18.5px 14px 18.5px 50px'
  };

  const searchStyleDefaults: React.CSSProperties = {
    boxSizing: 'border-box',
    width: '94%',
    color: 'inherit',
  };

  return {
    buttonStyleDefaults,
    containerStyleDefaults,
    dropdownStyleDefaults,
    inputStyleDefaults,
    searchStyleDefaults,
  };
};
