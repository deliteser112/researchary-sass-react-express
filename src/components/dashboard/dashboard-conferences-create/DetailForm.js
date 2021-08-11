/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';

// material
import { TextField, Typography, Box, Grid, Rating } from '@material-ui/core';
import axios from '../../../utils/axios';

// component
import { QuillEditor } from '../../editor';

import { UploadAvatar } from '../../upload';

const CLOUDINARY_URL = '/api/conference/upload-logo';
// ----------------------------------------------------------------------

DetailForm.propTypes = {
  currentConference: PropTypes.object,
  isEdit: PropTypes.bool,
  detailFormProps: PropTypes.func
};

export default function DetailForm({ currentConference, isEdit, detailFormProps }) {
  const [file, setFile] = useState(null);

  const [name, setName] = useState('New Conference');
  const [abbreviation, setAbbreviation] = useState('');
  const [description, setDescription] = useState('');
  const [publisher, setPublisher] = useState('');
  const [score, setScore] = useState(1);
  const [filename, setFilename] = useState('');

  const [detailFormData, setDetailFormData] = useState({});

  useEffect(() => {
    if (isEdit && currentConference !== undefined) {
      const { name, description, publisher, logoURL, score, abbreviation } = currentConference;
      let fname = logoURL.split('/');
      fname = fname[fname.length - 1];
      setFilename(fname);
      setFile({ ...file, preview: logoURL });
      setName(name);
      setDescription(description);
      setPublisher(publisher);
      setScore(score);
      setAbbreviation(abbreviation);
    }
  }, [currentConference, isEdit]);

  useEffect(() => {
    const detailObj = {
      filename,
      description,
      name,
      publisher,
      abbreviation,
      score
    };
    setDetailFormData({ ...detailObj });
  }, [description, name, publisher, abbreviation, score, filename]);

  useEffect(() => {
    detailFormProps(detailFormData);
  }, [detailFormData]);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangePublisher = (e) => {
    setPublisher(e.target.value);
  };

  const handleChangeAbbreviation = (e) => {
    setAbbreviation(e.target.value);
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
          label="Conference Name"
          value={name}
          onChange={handleChangeName}
          placeholder="Type the team name..."
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          placeholder="Name abbreviation e.g. ICSE"
          fullWidth
          label="Conference Name abbreviation"
          value={abbreviation}
          onChange={handleChangeAbbreviation}
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
          placeholder="Conference Publisher"
          fullWidth
          label="Publisher"
          value={publisher}
          onChange={handleChangePublisher}
        />
      </Grid>
      <Grid item xs={12}>
        <Box component="fieldset" mb={3} borderColor="transparent">
          <Typography component="legend">Conference Score</Typography>
          <Rating
            size="large"
            max={3}
            name="simple-controlled"
            value={score}
            onChange={(event, newValue) => {
              setScore(newValue);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
