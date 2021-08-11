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
  currentTeam: PropTypes.object,
  isEdit: PropTypes.bool,
  detailFormProps: PropTypes.func
};

export default function DetailForm({ currentTeam, isEdit, detailFormProps }) {
  const [file, setFile] = useState(null);

  const [name, setName] = useState('New Team');
  const [description, setDescription] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [filename, setFilename] = useState('');

  const [detailFormData, setDetailFormData] = useState({});

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

  const handleChangeName = (e) => {
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
      <Grid item xs={12} md={6}>
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
