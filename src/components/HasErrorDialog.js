import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

HasErrorDialog.propTypes = {
  errorContent: PropTypes.string,
  hasError: PropTypes.bool,
  errorProps: PropTypes.func
};

export default function HasErrorDialog({ errorContent, hasError, errorProps }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasError) {
      setOpen(true);
    }
  }, [errorContent, hasError]);

  const handleClose = () => {
    errorProps();
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{errorContent}</DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
