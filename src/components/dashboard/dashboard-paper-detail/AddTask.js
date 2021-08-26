import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
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
import closeFill from '@iconify/icons-eva/close-fill';

import { Grid, Box, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

//
import { MIconButton } from '../../@material-extend';
// hooks
import usePaper from '../../../hooks/usePaper';

// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getTaskList } from '../../../redux/slices/paper';

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
    padding: theme.spacing(3)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

AddTask.propTypes = {
  paperId: PropTypes.number,
  taskId: PropTypes.number,
  authors: PropTypes.array,
  isEdit: PropTypes.bool
};

export default function AddTask({ paperId, taskId, authors, isEdit }) {
  const dispatch = useDispatch();
  const { createTask, updateTask } = usePaper();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { taskList } = useSelector((state) => state.paper);

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [assignTo, setAssignTo] = useState(0);
  const [status, setStatus] = useState(0);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [details, setDetails] = useState('');

  const [pId, setPaperId] = useState(0);
  const [tId, setTaskId] = useState(0);

  const currentTask = taskList.find((task) => task.id === taskId);

  useEffect(() => {
    dispatch(getTaskList());
  }, [dispatch]);

  useEffect(() => {
    if (authors.length > 0) {
      setAssignTo(authors[0].id);
    }
  }, [authors]);

  useEffect(() => {
    if (isEdit && currentTask !== undefined) {
      const { title, assignedby, details, dueDate, id, paperId, status } = currentTask;

      setTaskId(id);
      setPaperId(paperId);

      setTitle(title);
      setDetails(details);
      setDueDate(dueDate);
      setAssignTo(assignedby.id);
      for (let i = 0; i < predefined.length; i += 1) {
        if (status === predefined[i].title) {
          setStatus(predefined[i].id);
          break;
        }
      }
    }
  }, [isEdit, currentTask]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeAssignedTo = (event) => {
    setAssignTo(event.target.value);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleSaveTask = () => {
    const taskData = {
      paperId,
      title,
      assignTo,
      status,
      dueDate,
      details
    };
    if (!isEdit) {
      createTask({ taskData }).then(() => {
        enqueueSnackbar('New Task is created', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        setOpen(false);
        setTimeout(() => {
          dispatch(getTaskList());
        }, 500);
      });
    } else {
      const updateData = { ...taskData, paperId: pId, taskId: tId };
      updateTask({ updateData }).then(() => {
        enqueueSnackbar('Task is updated', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        setOpen(false);
        setTimeout(() => {
          dispatch(getTaskList());
        }, 10);
      });
    }
  };

  return (
    <Box>
      <Box m={3} />
      {isEdit ? (
        <Button onClick={handleClickOpen} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 36 }} />
      ) : (
        <Button variant="contained" color="primary" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
          Add Task
        </Button>
      )}
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Task details
        </DialogTitle>
        <DialogContent dividers sx={{ padding: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Task title
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                id="outlined-basic"
                label="Task title"
                variant="outlined"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Assigned to
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <FormControl variant="outlined" sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-outlined-label">Assigned To</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={assignTo}
                  onChange={handleChangeAssignedTo}
                  label="Privacy"
                >
                  {authors.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      <Box sx={{ display: 'flex' }}>
                        <Box>
                          <Typography variant="body2">{`${item.firstname} ${item.lastname}`}</Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Status
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <FormControl variant="outlined" sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={status}
                  onChange={handleChangeStatus}
                  label="Privacy"
                >
                  {predefined.map((item, index) => (
                    <MenuItem key={index} value={index}>
                      <Box sx={{ display: 'flex' }}>
                        <Box>
                          <Typography variant="body2">{item.title}</Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Due date (optional)
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select date"
                  value={dueDate}
                  onChange={(newValue) => {
                    setDueDate(newValue.toISOString().split('T')[0]);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Details (optional)
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                id="outlined-multiline-static"
                label="Details"
                multiline
                rows={4}
                placeholder="Add any information relevant to the task"
                variant="outlined"
                sx={{ width: '100%' }}
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
          <Button autoFocus onClick={handleSaveTask} color="primary" variant="contained">
            Save Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// const authors = ['Zakwon Jaroucheh', 'Mhd Alisa'];
const predefined = [
  { id: 0, title: 'Not started' },
  { id: 1, title: 'In progress' },
  { id: 2, title: 'Completed' }
];
