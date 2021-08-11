/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

import { Grid, Box, Autocomplete } from '@material-ui/core';

ResearchAreasForm.propTypes = {
  teams: PropTypes.array,
  topics: PropTypes.array,
  isEdit: PropTypes.bool,
  currentConference: PropTypes.object,
  topicsFormProps: PropTypes.func
};

export default function ResearchAreasForm({ teams, topics, isEdit, topicsFormProps, currentConference }) {
  const [tags, setTags] = useState([]);

  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    console.log('M:', teams, topics);
  }, [teams, topics]);

  useEffect(() => {
    const areaObj = {
      topics: tags,
      teams: selectedTeams
    };
    topicsFormProps({ ...areaObj });
  }, [tags, selectedTeams]);

  useEffect(() => {
    if (isEdit && currentConference !== undefined) {
      const { topics, teams } = currentConference;
      setTags([...topics]);
      setSelectedTeams([...teams]);
    }
  }, [currentConference, isEdit]);

  const handleTeams = (team) => {
    setSelectedTeams(team);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={teams}
            getOptionLabel={(option) => option.name}
            value={[...selectedTeams]}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, team) => handleTeams(team)}
            filterSelectedOptions
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by Team Name"
                sx={{ width: '100%' }}
                placeholder="Type the team name..."
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="multiple-limit-tags"
            options={topics}
            onChange={(event, newValue) => setTags(newValue)}
            value={tags}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select at least one research area"
                placeholder="Enter main topics the..."
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
