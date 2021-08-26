/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';

// material
import { TextField, Typography, Box, Grid } from '@material-ui/core';
import axios from '../../../utils/axios';

// component
import { QuillEditor } from '../../editor';

import { UploadAvatar } from '../../upload';

const CLOUDINARY_URL = '/api/team/upload-logo';
// ----------------------------------------------------------------------

DetailForm.propTypes = {
  validation: PropTypes.object,
  currentTeam: PropTypes.object,
  isEdit: PropTypes.bool,
  detailFormProps: PropTypes.func
};

export default function DetailForm({ validation, currentTeam, isEdit, detailFormProps }) {
  const [file, setFile] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [filename, setFilename] = useState('');

  const [detailFormData, setDetailFormData] = useState({});

  const [hasName, setHasName] = useState(false);
  const [hasNameErrorText, setHasNameErrorText] = useState('');

  useEffect(() => {
    if (isEdit && currentTeam !== undefined) {
      const { name, description, affiliation, logoURL } = currentTeam;
      let fname = logoURL.split('/');
      fname = fname[fname.length - 1];
      setFilename(fname);
      setFile({ ...file, preview: logoURL });
      setName(name);
      setDescription(description);
      setAffiliation(affiliation);
    }
  }, [currentTeam, isEdit]);

  useEffect(() => {
    const detailObj = {
      filename,
      description,
      name,
      affiliation
    };
    setDetailFormData({ ...detailObj });
  }, [description, name, affiliation, filename]);

  useEffect(() => {
    detailFormProps(detailFormData);
  }, [detailFormData]);

  useEffect(() => {
    if (validation.name) {
      setHasName(true);
      setHasNameErrorText('The name is required!');
    }
  }, [validation]);

  const handleChangeName = (e) => {
    if (e.target.value.length === 0) {
      setHasName(true);
      setHasNameErrorText('The name is required!');
    } else {
      setHasName(false);
      setHasNameErrorText('');
    }
    setName(e.target.value);
  };

  const handleChangeAffiliation = (e) => {
    setAffiliation(e.target.value);
  };

  const handleDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile({
        ...file,
        preview: URL.createObjectURL(file)
      });
    }
    try {
      const formData = new FormData();
      formData.append('file', file);

      await axios
        .post(CLOUDINARY_URL, formData, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then((res) => {
          const { data } = res;
          const { filename } = data;
          setFilename(filename);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Grid container spacing={3.5} dir="ltr">
      <Box sx={{ margin: 'auto', my: 5 }}>
        <UploadAvatar
          accept="image/*"
          file={file}
          onDrop={handleDrop}
          maxSize={3145728}
          caption={
            <Typography
              variant="caption"
              sx={{
                mt: 2,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary'
              }}
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif
            </Typography>
          }
        />
      </Box>
      <Grid item xs={12}>
        <TextField
          error={hasName}
          helperText={hasNameErrorText}
          fullWidth
          value={name}
          onChange={handleChangeName}
          label="Team name"
          placeholder="Type the team name..."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          sx={{ display: 'none' }}
          error={hasName}
          helperText={hasNameErrorText}
          fullWidth
          label="Team name"
          value={name}
          onChange={handleChangeName}
          placeholder="Type the team name..."
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Description (Optional)</Typography>
        <QuillEditor
          id="post-content"
          value={description}
          onChange={setDescription}
          placeholder="Type the abstract or some information about the team..."
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField
          fullWidth
          label="Affiliation"
          value={affiliation}
          onChange={handleChangeAffiliation}
          placeholder="Type the affiliation..."
        />
      </Grid>
    </Grid>
  );
}
