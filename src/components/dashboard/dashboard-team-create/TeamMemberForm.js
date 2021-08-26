/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';

import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { TextField, Box, Button, Typography, Autocomplete } from '@material-ui/core';

import TeamMemberTable from './TeamMemberTable';
import HasErrorDialog from '../../HasErrorDialog';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: '98%'
  }
}));

TeamMemberForm.propTypes = {
  currentTeam: PropTypes.object,
  isEdit: PropTypes.bool,
  teamMembers: PropTypes.array,
  teamMembersFormProps: PropTypes.func
};

export default function TeamMemberForm({ currentTeam, isEdit, teamMembers, teamMembersFormProps }) {
  const theme = useTheme();
  const classes = useStyles();

  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [isAdded, setIsAdded] = useState(false);
  const [errorContent, setErrorContent] = useState('');

  useEffect(() => {
    teamMembersFormProps([]);
  }, []);

  useEffect(() => {
    if (isEdit) {
      const { members } = currentTeam;
      setMembers([...members]);
      teamMembersFormProps([...members]);
    }
  }, [currentTeam, isEdit]);

  const handleHasError = () => {
    setIsAdded(false);
  };

  const handleMembers = (member) => {
    teamMembersFormProps(member);
    setSelectedMembers(member);
  };

  const handleClickAddMembers = () => {
    const oldMembers = members;
    let isAdded = false;
    if (selectedMembers !== null && selectedMembers.email !== undefined) {
      members.map((member) => {
        if (member.email === selectedMembers.email) {
          isAdded = true;
        }
      });

      if (!isAdded) {
        oldMembers.push(selectedMembers);
        setMembers([...oldMembers]);
        teamMembersFormProps([...oldMembers]);
      } else {
        setIsAdded(true);
        setErrorContent('This member was already added!');
      }
    }
  };

  const handleDeleteProps = (newMembers) => {
    teamMembersFormProps([...newMembers]);
    setSelectedMembers([...newMembers]);
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ pl: 2 }}>
        You can invite one or more members to join your team
      </Typography>
      <Box m={3} />
      <Box sx={{ display: 'block', my: 2, [theme.breakpoints.up('md')]: { display: 'flex', alignItems: 'center' } }}>
        <Autocomplete
          id="tags-outlined"
          options={teamMembers}
          getOptionLabel={(option) => option.email}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, member) => handleMembers(member)}
          filterSelectedOptions
          sx={{ width: '100%' }}
          renderInput={(params) => (
            <TextField
              {...params}
              className={classes.margin}
              label="Search by name or email"
              sx={{ width: '100%' }}
              placeholder="Type the name or email..."
            />
          )}
        />
        <Button
          variant="contained"
          size="large"
          color="primary"
          sx={{ minWidth: 160, [theme.breakpoints.down('md')]: { width: '100%' } }}
          onClick={handleClickAddMembers}
        >
          Add members
        </Button>
      </Box>
      {members.length > 0 && (
        <>
          <TeamMemberTable members={members} deleteProps={handleDeleteProps} />
          <HasErrorDialog errorContent={errorContent} hasError={isAdded} errorProps={handleHasError} />
        </>
      )}
    </Box>
  );
}
