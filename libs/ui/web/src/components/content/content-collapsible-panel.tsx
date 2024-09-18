import React,
{
  useState
} from 'react';
import {
  Accordion,
  // AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Fade,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore,
} from '@mui/icons-material';
import { BeatLoader } from 'react-spinners';

import {
  RootState,
  useAppSelector
} from '@dx/store-web';
import {
  APP_COLOR_PALETTE,
  BORDER_RADIUS
} from '../../mui-overrides/styles';
import { FADE_TIMEOUT_DUR } from '../../ui.consts';
import { selectCurrentThemeMode } from '../../store/ui-web.selector';


export type CollapsiblePanelPropsType = {
  children: React.ReactNode;
  headerTitle: string;
  initialOpen?: boolean;
  isLoading?: boolean;
  panelId: string
 };

export const CollapsiblePanel: React.FC<CollapsiblePanelPropsType> = React.forwardRef((props, ref) => {
  const {
    children,
    headerTitle,
    initialOpen,
    isLoading,
    panelId
  } = props;
  const [expanded, setExpanded] = useState<string | false>(initialOpen ? panelId : false);
  const theme = useTheme();
  const SM_BREAK = useMediaQuery(theme.breakpoints.down('sm'));
  const themeMode = useAppSelector((state: RootState) => selectCurrentThemeMode(state));

  // const handleClickExpansion = (panelId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
  //   setExpanded(isExpanded ? panelId : false);
  // };

  return (
    <Box
      padding="0"
      ref={ref}
      width="100%"
    >
      <Accordion
        expanded={expanded === panelId}
        onChange={
          (event) => {
            if (SM_BREAK) {
              setExpanded(expanded !== panelId ? panelId : false);
              return;
            }
            event.stopPropagation();
          }
        }
        sx={
          {
            borderRadius: `0px 0px ${BORDER_RADIUS} ${BORDER_RADIUS} !important`
          }
        }
      >
        <AccordionSummary
          expandIcon={
            <IconButton
              onClick={
                () => {
                  setExpanded(expanded !== panelId ? panelId : false);
                }
              }
            >
              <ExpandMore
                sx={
                  (theme) => {
                    return {
                      color: theme.palette.common.white
                    };
                  }
                }
              />
            </IconButton>
          }
          sx={
            (theme) => {
              return {
                background: themeMode === 'dark'
                  ? theme.palette.common.black
                  : theme.palette.primary.light,
                borderRadius: expanded === panelId
                  ? `${BORDER_RADIUS} ${BORDER_RADIUS} 0px 0px`
                  : BORDER_RADIUS,
                cursor: SM_BREAK ? 'pointer' : 'default !important'
              };
            }
          }
          onClick={
            (event) => event.stopPropagation()
          }
        >
          <Typography
            variant={'subtitle1'}
            sx={
              (theme) => {
                return {
                  color: theme.palette.common.white
                };
              }
            }
          >
            { headerTitle }
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          { children }
          {
            <Fade in={isLoading} timeout={FADE_TIMEOUT_DUR}>
              <Box
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                sx={
                  {
                    backgroundColor: '#00000057',
                    position: 'absolute',
                    top: '68px',
                    left: 0,
                    zIndex: 100,
                    height: 'fill-available',
                    width: 'fill-available'
                  }
                }
              >
                <BeatLoader
                  size={24}
                  color={APP_COLOR_PALETTE.SECONDARY[700]}
                />
              </Box>
            </Fade>
          }
        </AccordionDetails>
      </Accordion>
    </Box>
  )
});
