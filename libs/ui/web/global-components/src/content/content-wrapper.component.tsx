import React from 'react';
import {
  Divider,
  Fade,
  Grid2,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

import { FADE_TIMEOUT_DUR } from '@dx/ui-web-system';
import { StyledContentFixedHeader } from './content-fixed-header.styled';
import { StyledContentWrapper } from './content-wrapper.styled';

export type ContentWrapperPropsType = {
  children: React.ReactNode;
  headerTitle: string;
  contentMarginTop?: string;
  headerColumnRightJustification?: string;
  headerColumnsBreaks?: {
    left?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
    };
    right?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
    };
  };
  headerContent?: React.ReactNode;
  headerSubTitle?: string;
  navigation?: () => void;
  tooltip?: string;
};

export const ContentWrapper: React.FC<ContentWrapperPropsType> = (props) => {
  const {
    children,
    contentMarginTop,
    headerColumnsBreaks,
    headerColumnRightJustification,
    headerContent,
    headerSubTitle,
    headerTitle,
    navigation,
    tooltip,
  } = props;
  const THEME = useTheme();
  const MD_BREAK = useMediaQuery(THEME.breakpoints.down('md'));
  const SM_BREAK = useMediaQuery(THEME.breakpoints.down('sm'));

  const renderHeaderNavigation = (): JSX.Element => {
    if (tooltip) {
      return (
        <Tooltip title={tooltip}>
          <IconButton
            color="primary"
            component="span"
            onClick={() => {
              if (typeof navigation === 'function') {
                navigation();
              }
            }}
          >
            <ChevronLeft />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <IconButton
        color="primary"
        component="span"
        onClick={() => {
          if (typeof navigation === 'function') {
            navigation();
          }
        }}
      >
        <ChevronLeft />
      </IconButton>
    );
  };

  const renderHeader = (): JSX.Element => {
    return (
      <StyledContentFixedHeader>
        <Grid2
          container
          justifyContent="space-between"
          alignItems={'center'}
          padding="14px 16px 14px"
          direction={'row'}
        >
          <Grid2
            size={{
              xs: headerColumnsBreaks?.left?.xs || 12,
              sm: headerColumnsBreaks?.left?.sm || 6,
              md: headerColumnsBreaks?.left?.md || 6
            }}
            width="100%"
            mb={
              SM_BREAK && (headerColumnsBreaks?.left?.xs || 12) === 12
                ? '12px'
                : undefined
            }
          >
            <Typography
              variant="h5"
              color="primary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {navigation && renderHeaderNavigation()}
              <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
                <span>{headerTitle}</span>
              </Fade>
            </Typography>
            {headerSubTitle && (
              <span
                style={{
                  margin: '-10px 0 0 44px',
                }}
              >
                <Typography variant="caption" color="primary">
                  {headerSubTitle}
                </Typography>
              </span>
            )}
          </Grid2>
          <Grid2
            display="flex"
            size={{
              xs: headerColumnsBreaks?.right?.xs || 12,
              sm: headerColumnsBreaks?.right?.sm || 6,
              md: headerColumnsBreaks?.right?.md || 6
            }}
            justifyContent={headerColumnRightJustification}
            width="100%"
          >
            {headerContent}
          </Grid2>
        </Grid2>
        <Divider />
      </StyledContentFixedHeader>
    );
  };

  return (
    <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
      <Grid2
        container
        spacing={0}
        direction="column"
        justifyContent="flex-start"
        wrap="nowrap"
        sx={{
          height: MD_BREAK ? undefined : '100%',
        }}
      >
        {renderHeader()}
        <StyledContentWrapper
          sx={{
            marginTop: contentMarginTop,
          }}
        >
          {children}
        </StyledContentWrapper>
      </Grid2>
    </Fade>
  );
};
