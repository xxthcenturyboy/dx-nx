import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { themeColors } from '../../muiOverrides/styles';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

export function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const [lastOffset, setLastOffset] = useState<number>(0);

  useEffect(() => {
    const n = count !== undefined ?
      Math.max(0, Math.ceil(count / rowsPerPage) - 1)
      : 1;
    setLastOffset(n);
  }, []);

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (page === 0) {
      return;
    }
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (page === 0) {
      return;
    }
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (page === lastOffset) {
      return;
    }
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (page === lastOffset) {
      return;
    }
    onPageChange(event, lastOffset);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        style={{ color: page === 0 ? themeColors.dark.secondary : themeColors.primary }}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        style={{ color: page === 0 ? themeColors.dark.secondary : themeColors.primary }}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= lastOffset}
        aria-label="next page"
        style={{ color: page >= lastOffset ? themeColors.dark.secondary : themeColors.primary }}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= lastOffset}
        aria-label="last page"
        style={{ color: page >= lastOffset ? themeColors.dark.secondary : themeColors.primary }}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
