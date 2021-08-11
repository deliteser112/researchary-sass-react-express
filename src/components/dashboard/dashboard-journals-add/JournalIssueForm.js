import React, { useState } from 'react';
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

import { Grid, InputAdornment, FormControlLabel, Checkbox, Box, Autocomplete } from '@material-ui/core';

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
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function CustomizedDialogs() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [deadlineDate, setDeadlineDate] = useState(null);
  const [openRequest, setOpenRequest] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeOpenRequest = () => {
    setOpenRequest(!openRequest);
  };

  return (
    <Box>
      <Typography variant="body2">
        Usually journals take place on a yearly basis. You can add one or more issues of this journal.
      </Typography>
      <Box m={3} />
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        sx={{ padding: theme.spacing(2, 4), borderStyle: 'dashed' }}
      >
        + Add a new journal issue
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add journal issue
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Year
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <Autocomplete
                sx={{ width: '100%' }}
                id="combo-box-demo"
                options={years}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} label="Select Year" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Submission deadline"
                  value={deadlineDate}
                  onChange={(newValue) => {
                    setDeadlineDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="input-with-icon-textfield"
                label="Journal Website"
                sx={{ width: '100%' }}
                placeholder="https://example.com"
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
                control={<Checkbox checked={openRequest} onChange={handleChangeOpenRequest} name="antoine" />}
                label="This year it will be online"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
          <Button autoFocus onClick={handleClose} color="primary" variant="contained">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const years = ['2021', '2022', '2023', '2024', '2025'];
