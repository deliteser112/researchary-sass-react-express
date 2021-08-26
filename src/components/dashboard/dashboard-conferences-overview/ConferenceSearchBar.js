import PropTypes from 'prop-types';

import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  useMediaQuery
} from '@material-ui/core';

import MenuPopover from '../../MenuPopover';

import { CONSTANTS } from '../../../utils/constants';
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

ConferenceListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  filterCountry: PropTypes.object,
  filterRating: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterCountry: PropTypes.func,
  onFilterRating: PropTypes.func
};

export default function ConferenceListToolbar({
  filterName,
  filterCountry,
  filterRating,
  onFilterName,
  onFilterCountry,
  onFilterRating
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setLocations(CONSTANTS.locations);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <RootStyle>
      <SearchStyle
        value={filterName}
        onChange={onFilterName}
        placeholder="Search conferences..."
        startAdornment={
          <InputAdornment position="start">
            <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />
      {isDesktop ? (
        <Box sx={{ width: 500, display: 'flex' }}>
          <Autocomplete
            sx={{ width: '100%' }}
            id="combo-box-demo"
            options={locations}
            onClick={handleClose}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => onFilterCountry(newValue)}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            value={filterCountry}
            renderInput={(params) => <TextField {...params} label="Select Country" variant="outlined" />}
          />
          <FormControl variant="outlined" sx={{ width: '100%', ml: 2 }}>
            <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={filterRating}
              onChange={onFilterRating}
              onClick={handleClose}
              label="Year"
            >
              {rates.map((item) => (
                <MenuItem key={item} value={item === 0 ? '' : item.toString()}>
                  {item === 0 ? (
                    <Typography variant="body2">All rating</Typography>
                  ) : (
                    <Rating name="read-only" size="small" max={3} value={item} readOnly />
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <>
          <Tooltip title="Filter list" placement="top">
            <IconButton ref={anchorRef} onClick={handleOpen}>
              <Icon icon={roundFilterList} />
            </IconButton>
          </Tooltip>
          <MenuPopover
            open={open}
            onClose={handleClose}
            anchorEl={anchorRef.current}
            sx={{ px: 3, pb: 4, minWidth: 300 }}
          >
            <Box sx={{ my: 1.5 }}>
              <Typography variant="subtitle1" noWrap>
                Filter conferences
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />
            <Box m={2} />
            <Autocomplete
              sx={{ width: '100%' }}
              id="combo-box-demo"
              options={locations}
              onClick={handleClose}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => onFilterCountry(newValue)}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              value={filterCountry}
              renderInput={(params) => <TextField {...params} label="Select Country" variant="outlined" />}
            />
            <Box m={3} />
            <FormControl variant="outlined" sx={{ width: '100%' }}>
              <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={filterRating}
                onChange={onFilterRating}
                onClick={handleClose}
                label="Year"
              >
                {rates.map((item) => (
                  <MenuItem key={item} value={item === 0 ? '' : item.toString()}>
                    {item === 0 ? (
                      <Typography variant="body2">All rating</Typography>
                    ) : (
                      <Rating name="read-only" size="small" max={3} value={item} readOnly />
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MenuPopover>
        </>
      )}
    </RootStyle>
  );
}

const rates = [0, 1, 2, 3];
