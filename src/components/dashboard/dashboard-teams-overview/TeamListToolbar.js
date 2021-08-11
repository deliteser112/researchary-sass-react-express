import PropTypes from 'prop-types';

import React, { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
// material
import { useTheme, experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Divider
} from '@material-ui/core';
import MenuPopover from '../../MenuPopover';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

TeamListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function TeamListToolbar({ numSelected, filterName, onFilterName }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search teams..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list" placement="top">
          <IconButton ref={anchorRef} onClick={handleOpen}>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      )}
      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ px: 3, pb: 4, minWidth: 300 }}>
        <Box sx={{ my: 1.5 }}>
          <Typography variant="subtitle1" noWrap>
            Filter teams
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography variant="subtitle">Status</Typography>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={Status}
          sx={{ width: '100%' }}
          renderInput={(params) => <TextField {...params} label="Any Status" />}
        />
      </MenuPopover>
    </RootStyle>
  );
}

const Status = ['Not started', 'In progress', 'On Hold', 'Ready to submit', 'Under review', 'Accepted', 'Rejected'];
