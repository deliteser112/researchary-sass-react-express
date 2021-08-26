import PropTypes from 'prop-types';

import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

ConfirmDialog.propTypes = {
  deleteTitle: PropTypes.string,
  deleteId: PropTypes.number,
  deleteProps: PropTypes.func
};

export default function ConfirmDialog({ deleteId, deleteTitle, deleteProps }) {
  const [open, setOpen] = React.useState(false);

  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setId(deleteId);
    setTitle(deleteTitle);
  }, [deleteId, deleteTitle]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteProps(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <IconButton aria-label="delete" onClick={handleClickOpen} sx={{ color: '#ff4842' }}>
        <DeleteIcon />
      </IconButton> */}
      <Button onClick={handleClickOpen} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 36 }} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure making to delete "{title}"?</DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={handleConfirmDelete} color="error">
            Yes
          </Button>
          <Button variant="outlined" onClick={handleClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
