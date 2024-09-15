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
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore,
} from '@mui/icons-material';
import {
  APP_COLOR_PALETTE,
  BORDER_RADIUS
} from '../../mui-overrides/styles';

export type CollapsiblePanelPropsType = {
  children: React.ReactNode;
  headerTitle: string;
  panelId: string
 };

export const CollapsiblePanel: React.FC<CollapsiblePanelPropsType> = React.forwardRef((props, ref) => {
  const {
    children,
    headerTitle,
    panelId
  } = props;
  const [expanded, setExpanded] = useState<string | false>(panelId);
  const theme = useTheme();
  const SM_BREAK = useMediaQuery(theme.breakpoints.down('sm'));

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
                color='secondary'
              />
            </IconButton>
          }
          sx={
            {
              background: APP_COLOR_PALETTE.PRIMARY[900],
              borderRadius: expanded === panelId
                ? `${BORDER_RADIUS} ${BORDER_RADIUS} 0px 0px`
                : BORDER_RADIUS,
              cursor: SM_BREAK ? 'pointer' : 'default !important'
            }
          }
          onClick={
            (event) => event.stopPropagation()
          }
        >
          <Typography
            variant={'subtitle1'}
            color="secondary"
          >
            { headerTitle }
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          { children }
        </AccordionDetails>
      </Accordion>
    </Box>
  )
});
