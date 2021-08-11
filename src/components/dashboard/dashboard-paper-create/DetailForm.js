/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import PublicIcon from '@material-ui/icons/Public';
// material
import {
  TextField,
  Typography,
  Box,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Grid,
  FormControlLabel,
  Checkbox,
  Autocomplete
} from '@material-ui/core';

// component
import { QuillEditor } from '../../editor';
// ----------------------------------------------------------------------

DetailForm.propTypes = {
  currentPaper: PropTypes.object,
  isEdit: PropTypes.bool,
  topics: PropTypes.array,
  privacies: PropTypes.array,
  detailFormProps: PropTypes.func
};

export default function DetailForm({ currentPaper, isEdit, topics, privacies, detailFormProps }) {
  const [privacy, setPrivacy] = useState(0);
  const [openRequest, setOpenRequest] = useState(false);

  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('New Paper');
  const [description, setDescription] = useState('');

  const [detailFormData, setDetailFormData] = useState({});

  useEffect(() => {
    console.log(currentPaper, isEdit);
    if (isEdit && currentPaper !== undefined) {
      const { title, description, privacy, topics, openRequest } = currentPaper;
      setTitle(title);
      setDescription(description);
      setPrivacy(privacy);
      setOpenRequest(!!openRequest);
      console.log('Here is topics->', topics);
      setTags([...topics]);
    }
  }, [currentPaper, isEdit]);

  useEffect(() => {
    const detailObj = {
      description,
      title,
      tags,
      privacy,
      openRequest
    };
    setDetailFormData({ ...detailObj });
  }, [description, title, tags, privacy, openRequest]);

  useEffect(() => {
    detailFormProps(detailFormData);
  }, [detailFormData]);

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case ',': {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length > 0) {
          setTags([...tags, event.target.value]);
        }
        break;
      }
      default:
    }
  };

  const handleChangePrivacy = (event) => {
    setPrivacy(event.target.value);
  };

  const handleChangeOpenRequest = () => {
    setOpenRequest(!openRequest);
  };

  return (
    <Grid container spacing={3.5} dir="ltr">
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Paper title"
          value={title}
          onChange={handleChangeTitle}
          placeholder="Type the paper title..."
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Description (Optional)</Typography>
        <QuillEditor
          id="post-content"
          value={description}
          onChange={setDescription}
          placeholder="Type the abstract or some information about the paper..."
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          freeSolo
          id="multiple-limit-tags"
          options={topics}
          onChange={(event, newValue) => setTags(newValue)}
          getOptionLabel={(option) => option}
          value={tags}
          renderInput={(params) => {
            params.inputProps.onKeyDown = handleKeyDown;
            return <TextField {...params} variant="outlined" label="Paper research topic(s)" />;
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl variant="outlined" sx={{ width: '100%' }}>
          <InputLabel id="demo-simple-select-outlined-label">Privacy</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={privacy}
            onChange={handleChangePrivacy}
            label="Privacy"
          >
            {privacies.map((item, index) => (
              <MenuItem key={index} value={index}>
                <Box sx={{ display: 'flex' }}>
                  {index === 0 && <PublicIcon sx={{ mr: 2 }} />}
                  {index === 1 && <PeopleAltIcon sx={{ mr: 2 }} />}
                  {index === 2 && <LockIcon sx={{ mr: 2 }} />}
                  {index === 3 && <PersonIcon sx={{ mr: 2 }} />}
                  <Box>
                    <Typography variant="body2">{item.title}</Typography>
                    <Typography variant="caption" sx={{ ...(privacy === index && { display: 'none' }) }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox checked={openRequest} onChange={handleChangeOpenRequest} name="antoine" />}
          label="Open for anyone to request co-authering this paper"
        />
      </Grid>
    </Grid>
  );
}
