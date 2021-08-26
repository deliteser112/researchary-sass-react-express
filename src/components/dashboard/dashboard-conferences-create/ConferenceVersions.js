/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

import React, { useState, useEffect } from 'react';

import { withStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import LinkIcon from '@material-ui/icons/Link';
import AddIcon from '@material-ui/icons/Add';

import {
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Box,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

import ConferenceTable from './ConferenceTable';

import { CONSTANTS } from '../../../utils/constants';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 3)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

ConferenceVersions.propTyes = {
  currentConference: PropTypes.object,
  isEdit: PropTypes.bool,
  versionFormProps: PropTypes.func
};

export default function ConferenceVersions({ currentConference, isEdit, versionFormProps }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [isOnline, setIsOnline] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  const [country, setCountry] = useState({ name: 'Afghanistan', code: 'AF' });
  const [submissionLink, setSubmissionLink] = useState('');
  const [conferenceSite, setConferenceSite] = useState('');
  const [city, setCity] = useState('');

  const [cVersion, setCVersion] = useState({});

  const [conferenceVersions, setConferenceVersions] = useState([]);

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setLocations(CONSTANTS.locations);
  }, [CONSTANTS]);

  useEffect(() => {
    if (isEdit && currentConference !== undefined && versionFormProps !== undefined) {
      const { versions } = currentConference;
      setConferenceVersions([...versions]);
      versionFormProps([...versions]);
    }
  }, [currentConference, isEdit]);

  useEffect(() => {
    const versionObj = {
      year,
      country,
      city,
      startDate,
      endDate,
      submissionDate,
      submissionLink,
      conferenceSite,
      isOnline
    };
    setCVersion({ ...versionObj });
  }, [year, country, city, startDate, endDate, submissionDate, submissionLink, conferenceSite, isOnline]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeIsOnline = () => {
    setIsOnline(!isOnline);
  };

  const handleChangeYear = (e) => {
    setYear(e.target.value);
  };

  const handleSubmissionLink = (e) => {
    setSubmissionLink(e.target.value);
  };

  const handleConferenceSite = (e) => {
    setConferenceSite(e.target.value);
  };

  const handleChangeCity = (e) => {
    setCity(e.target.value);
  };

  const handleSaveConferenceVersion = () => {
    const tmpVersions = conferenceVersions;
    tmpVersions.push(cVersion);
    setConferenceVersions([...tmpVersions]);
    setOpen(false);
    versionFormProps(tmpVersions);
  };

  return (
    <Box>
      <Typography variant="body2">
        Usually conferences take place on a yearly basis. You can add one or more versions of this conference.
      </Typography>
      <Box m={3} />
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        sx={{ padding: theme.spacing(2, 4), borderStyle: 'dashed' }}
      >
        + Add a new conference version
      </Button>
      <Box m={2} />
      {conferenceVersions.length > 0 && <ConferenceTable conferences={conferenceVersions} />}
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add conference version
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ [theme.breakpoints.up('sm')]: { py: 2 } }}>
                Year
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <FormControl variant="outlined" sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-outlined-label">Select Year</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={year}
                  onChange={handleChangeYear}
                  label="Year"
                >
                  {years.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      <Box sx={{ display: 'flex' }}>
                        <Box>
                          <Typography variant="body2">{item}</Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ [theme.breakpoints.up('sm')]: { py: 2 } }}>
                Location
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <Autocomplete
                sx={{ width: '100%' }}
                id="combo-box-demo"
                options={locations}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => setCountry(newValue)}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                value={country}
                renderInput={(params) => <TextField {...params} label="Select Country" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12} md={3} />
            <Grid item xs={12} md={9}>
              <TextField
                id="outlined-basic"
                label="City"
                variant="outlined"
                value={city}
                onChange={handleChangeCity}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue.toISOString().split('T')[0]);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue.toISOString().split('T')[0]);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Submission deadline"
                  value={submissionDate}
                  onChange={(newValue) => {
                    setSubmissionDate(newValue.toISOString().split('T')[0]);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="input-with-icon-textfield"
                label="Conference Website"
                sx={{ width: '100%' }}
                placeholder="https://example.com"
                value={conferenceSite}
                onChange={handleConferenceSite}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="input-with-icon-textfield"
                label="Submission link"
                sx={{ width: '100%' }}
                placeholder="https://example.com"
                value={submissionLink}
                onChange={handleSubmissionLink}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={isOnline} onChange={handleChangeIsOnline} name="antoine" />}
                label="This year it will be online"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveConferenceVersion} startIcon={<AddIcon />}>
            Add Verison
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const years = [2021, 2022, 2023, 2024, 2025];
