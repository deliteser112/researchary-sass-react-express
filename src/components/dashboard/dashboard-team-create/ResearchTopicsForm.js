/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@material-ui/core/styles';

import { Autocomplete, Box, TextField } from '@material-ui/core';

ResearchTopicsForm.propTypes = {
  currentTeam: PropTypes.object,
  isEdit: PropTypes.bool,
  topics: PropTypes.array,
  topicsFormProps: PropTypes.func
};

export default function ResearchTopicsForm({ currentTeam, isEdit, topics, topicsFormProps }) {
  const [tags, setTags] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    topicsFormProps([...tags]);
  }, [tags]);

  useEffect(() => {
    if (isEdit && currentTeam !== undefined) {
      const { topics } = currentTeam;
      setTags([...topics]);
    }
  }, [currentTeam, isEdit]);

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

  return (
    <Box sx={{ width: '100%', padding: theme.spacing(0) }}>
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
    </Box>
  );
}
