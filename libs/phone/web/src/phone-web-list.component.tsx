import React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  styled,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

import { useAppDispatch } from '@dx/store-web';
import { uiActions } from '@dx/ui-web-system';
import { PhoneType } from '@dx/phone-shared';
import { AddPhoneDialog } from './phone-web-create.dialog';
import { DeletePhoneDialog } from './phone-web-delete.dialog';

export type UserPhonesProps = {
  phones?: PhoneType[];
  userId: string;
  phoneDataCallback: (email: PhoneType) => void;
  phoneDeleteCallback: (email: PhoneType) => void;
};

export const Phonelist: React.FC<UserPhonesProps> = (props) => {
  const { phones, userId, phoneDataCallback, phoneDeleteCallback } = props;
  const dispatch = useAppDispatch();
  const rowHeight = '32px';

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    minHeight: '100px',
    // '&:hover': {
    // backgroundColor: themeMode && themeMode === 'dark' ? theme.palette.primary.light : theme.palette.secondary.main,
    // }
  }));

  return (
    <Box margin="20px 0" width="100%">
      <Paper elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          marginBottom={'8px'}
        >
          {/* Title */}
          <Grid item>
            <Typography variant="h6" color="primary">
              Phones
            </Typography>
          </Grid>
          {/* New Phone */}
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              size={'small'}
              onClick={() =>
                dispatch(
                  uiActions.appDialogSet(
                    <AddPhoneDialog
                      userId={userId}
                      phoneDataCallback={phoneDataCallback}
                    />
                  )
                )
              }
            >
              New Phone
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <TableContainer component={Box}>
          <Table stickyHeader size="small" aria-label="" id="table-user-phones">
            <TableBody>
              {!phones ||
                (phones && !phones.length && (
                  <StyledTableRow>
                    <TableCell
                      colSpan={3}
                      sx={{
                        height: '200px',
                        textAlign: 'center',
                        fontSize: '42px',
                        color: 'primary',
                      }}
                    >
                      No Data
                    </TableCell>
                  </StyledTableRow>
                ))}
              {!!phones &&
                !!phones.length &&
                phones.map((phone: PhoneType) => {
                  return (
                    <StyledTableRow
                      key={phone.id}
                      sx={{
                        // cursor: 'pointer',
                        height: rowHeight,
                      }}
                      // onClick={() => editPhone(phone)}
                    >
                      <TableCell
                        align="left"
                        sx={{
                          height: '20px',
                          textWrap: 'nowrap',
                        }}
                      >
                        {phone.uiFormatted || phone.phone}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          height: '20px',
                          textWrap: 'nowrap',
                        }}
                      >
                        {phone.label}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          height: '32px',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {phone.isVerified && (
                          <Chip
                            label="Verified"
                            color="success"
                            sx={{ height: '20px', marginRight: '10px' }}
                          />
                        )}
                        {phone.default && (
                          <Chip
                            label="Default"
                            color="info"
                            sx={{ height: '20px', marginRight: '10px' }}
                          />
                        )}
                        {!phone.default && (
                          <Tooltip title="Delete Phone">
                            <Delete
                              onClick={(event: React.SyntheticEvent) => {
                                event.stopPropagation();
                                dispatch(
                                  uiActions.appDialogSet(
                                    <DeletePhoneDialog
                                      phoneItem={phone}
                                      phoneDataCallback={phoneDeleteCallback}
                                    />
                                  )
                                );
                              }}
                              color="primary"
                              style={{
                                cursor: 'pointer',
                                width: '0.75em',
                                margin: '0 10 0 0',
                              }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
