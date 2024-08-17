import React from 'react';
import {
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  styled,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Add,
  Delete
} from '@mui/icons-material';

import {
  useAppDispatch
} from '@dx/store-web';
import {
  uiActions
} from '@dx/ui-web';
import { EmailType } from '@dx/email-shared';
import { AddEmailDialog } from './email-web-create.dialog';
import { DeleteEmailDialog } from './email-web-delete.dialog';

type EmailListPropsType = {
  emails: EmailType[];
  userId: string;
  emailDataCallback: (email: EmailType) => void;
  emailDeleteCallback: (email: EmailType) => void;
};

export const EmailList: React.FC<EmailListPropsType> = (props) => {
  const {
    emails,
    userId,
    emailDataCallback,
    emailDeleteCallback
  } = props;
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
    //   backgroundColor: themeMode && themeMode === 'dark' ? theme.palette.primary.light : theme.palette.secondary.main,
    // }
  }));

  return (
    <Box
      margin="20px 0"
      width="100%"
    >
      <Paper
        elevation={0}
        sx={{ backgroundColor: 'transparent' }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Title */}
          <Grid item>
            <Typography
              variant="body1"
              color="primary"
            >
              Emails
            </Typography>
          </Grid>
          {/* New Email */}
          <Grid item>
            <IconButton
              color="primary"
              component="span"
              onClick={
                () => dispatch(uiActions.appDialogSet(
                  <AddEmailDialog
                    userId={userId}
                    emailDataCallback={emailDataCallback}
                  />
                ))
              }
            >
              <Add />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <TableContainer
          component={Box}
        >
          <Table
            stickyHeader
            size="small"
            aria-label=""
            id="table-user-emails"
          >
            <TableBody>
              {
                !emails
                || (emails && !emails.length)
                && (
                  <StyledTableRow>
                    <TableCell
                      colSpan={3}
                      sx={{
                        height: '200px',
                        textAlign: 'center',
                        fontSize: '42px',
                        color: 'primary'
                      }}
                    >
                      No Data
                    </TableCell>
                  </StyledTableRow>
                )
              }
              {
                !!emails
                && !!emails.length
                && emails.map((email: EmailType) => {
                  return (
                    <StyledTableRow
                      key={email.id}
                      sx={{
                        // cursor: 'pointer',
                        height: rowHeight
                      }}
                      // onClick={() => editEmail(email)}
                    >
                      <TableCell
                        align="left"
                        sx={
                          {
                            height: '20px',
                            textWrap: 'nowrap'
                          }
                        }
                      >
                        { email.email }
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={
                          {
                            height: '20px',
                            textWrap: 'nowrap'
                          }
                        }
                      >
                        { email.label }
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          height: '32px',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-end'
                        }}
                      >
                        {
                          email.isVerified && (
                            <Chip
                              label="Verified"
                              color="primary"
                              sx={{ height: '20px', marginRight: '10px' }}
                            />
                          )
                        }
                        {
                          email.default && (
                            <Chip
                              label="Default"
                              color="success"
                              sx={{ height: '20px', marginRight: '10px' }}
                            />
                          )
                        }
                        {
                          !email.default && (
                            <Tooltip title="Delete Email">
                              <Delete
                                onClick={(event: React.SyntheticEvent) => {
                                  event.stopPropagation();
                                  dispatch(uiActions.appDialogSet(
                                    <DeleteEmailDialog
                                      emailItem={email}
                                      emailDataCallback={emailDeleteCallback}
                                    />
                                  ));
                                }}
                                color="primary"
                                style={{ cursor: 'pointer', width: '0.75em', margin: '0 10 0 0' }}
                              />
                            </Tooltip>
                          )
                        }
                      </TableCell>
                    </StyledTableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
