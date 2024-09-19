import {
  TableCell,
  tableCellClasses,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTableCell = styled(TableCell)<{
  thememode: string;
}>(({ theme, thememode }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor:
      thememode === 'dark'
        ? theme.palette.common.black
        : theme.palette.primary.light,
    color: theme.palette.common.white,
    padding: '16px',
  },
}));

export const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  '&.Mui-active': {
    color: theme.palette.secondary.light,
  },
  '& .MuiTableSortLabel-icon': {
    // color: `white !important`
    color: `${theme.palette.secondary.light} !important`,
  },
}));

export const StyledTableRow = styled(TableRow)<{
  loading: string;
  thememode: string;
}>(({ loading, theme, thememode }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor:
      loading === 'true' ? 'transparent' : theme.palette.action.hover,
  },
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
  '&:hover': {
    backgroundColor:
      loading !== 'true'
        ? thememode === 'dark'
          ? theme.palette.primary.light
          : theme.palette.secondary.light
        : 'initial',
  },
}));
