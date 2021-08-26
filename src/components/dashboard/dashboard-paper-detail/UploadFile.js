import PropTypes from 'prop-types';

import React, { useState, useCallback, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { Switch, Box, Card, CardHeader, CardContent, FormControlLabel } from '@material-ui/core';

import { UploadMultiFile } from '../../upload';

import axios from '../../../utils/axios';
// ----------------------------------------------------------------------

const CLOUDINARY_URL = '/api/paper/upload-files';

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

UploadFile.propTypes = {
  currentPaper: PropTypes.object,
  uploadProps: PropTypes.func
};

export default function UploadFile({ currentPaper, uploadProps }) {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [paperId, setPaperId] = useState(0);

  useEffect(() => {
    const { id } = currentPaper;
    setPaperId(id);
  }, [currentPaper]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [preview, setPreview] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFiles]
  );

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };

  const handleUploadFiles = async () => {
    setIsLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('paperId[]', paperId);
      formData.append('filesize[]', file.size);
      formData.append('files', file);
    });

    await axios
      .post(CLOUDINARY_URL, formData, {
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'multipart/form-data' }
      })
      .then(() => {
        setIsLoading(false);
        uploadProps();
      });
    handleClose();
  };

  return (
    <Box>
      <Box m={3} />
      <Button variant="contained" color="primary" onClick={handleClickOpen} startIcon={<CloudUploadIcon />}>
        Upload File
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogContent dividers>
          <Card>
            <CardHeader
              title="Add Files"
              action={
                <FormControlLabel
                  control={<Switch checked={preview} onChange={(event) => setPreview(event.target.checked)} />}
                  label="Show Preview"
                />
              }
            />
            <CardContent>
              <UploadMultiFile
                showPreview={preview}
                files={files}
                accept={fileType}
                onDrop={handleDropMultiFile}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
                uploadFiles={handleUploadFiles}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

const fileType =
  'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/*';
