import React from 'react';
import {
  Accessibility,
  Check,
  CheckBox,
  CheckBoxOutlineBlank,
  Dashboard,
  HealthAndSafety,
  ManageAccounts,
  MenuOpen,
  People,
  PeopleOutline,
} from '@mui/icons-material';
import { IconNames } from './enums';

export const getIcon = (
  name: IconNames,
  color?: string
): React.ReactElement | null => {
  if (name === IconNames.ACCESSIBLITY) {
    return <Accessibility style={{ color }} />;
  }
  if (name === IconNames.CHECK) {
    return <Check style={{ color }} />;
  }
  if (name === IconNames.CHECKBOX) {
    return <CheckBox style={{ color }} />;
  }
  if (name === IconNames.CHECKBOX_OUTLINED_BLANK) {
    return <CheckBoxOutlineBlank style={{ color }} />;
  }
  if (name === IconNames.DASHBOARD) {
    return <Dashboard style={{ color }} />;
  }
  if (name === IconNames.HEALTHZ) {
    return <HealthAndSafety style={{ color }} />;
  }
  if (name === IconNames.MANAGE_ACCOUNTS) {
    return <ManageAccounts style={{ color }} />;
  }
  if (name === IconNames.MENU_OPEN) {
    return <MenuOpen style={{ color }} />;
  }
  if (name === IconNames.PEOPLE) {
    return <People style={{ color }} />;
  }
  if (name === IconNames.PEOPLE_OUTLINE) {
    return <PeopleOutline style={{ color }} />;
  }

  return null;
};
