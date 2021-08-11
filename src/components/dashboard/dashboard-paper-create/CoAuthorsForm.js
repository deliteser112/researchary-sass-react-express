/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';

import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { TextField, Box, Button, Typography, Autocomplete } from '@material-ui/core';

import CoAuthorsTable from './CoAuthorsTable';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: '98%'
  }
}));

CoAuthorsForm.propTypes = {
  currentPaper: PropTypes.object,
  isEdit: PropTypes.bool,
  coAuthors: PropTypes.array,
  coAuthorFormProps: PropTypes.func
};

export default function CoAuthorsForm({ currentPaper, isEdit, coAuthors, coAuthorFormProps }) {
  const theme = useTheme();
  const classes = useStyles();

  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  useEffect(() => {
    coAuthorFormProps([]);
  }, []);

  useEffect(() => {
    if (isEdit) {
      const { authors } = currentPaper;
      setAuthors([...authors]);
      setSelectedAuthors([...authors]);
      coAuthorFormProps([...authors]);
    }
  }, [currentPaper, isEdit]);

  const handleAuthors = (author) => {
    coAuthorFormProps(author);
    setSelectedAuthors(author);
  };

  const handleClickAddCoAuthors = () => {
    setAuthors(selectedAuthors);
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ pl: 2 }}>
        You can invite one or more authors to join your paper
      </Typography>
      <Box m={3} />
      <Box sx={{ display: 'block', my: 2, [theme.breakpoints.up('md')]: { display: 'flex', alignItems: 'center' } }}>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={coAuthors}
          getOptionLabel={(option) => option.email}
          value={[...selectedAuthors]}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, author) => handleAuthors(author)}
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
          onClick={handleClickAddCoAuthors}
        >
          Add co-author
        </Button>
      </Box>
      {authors.length > 0 && <CoAuthorsTable coAuthors={authors} />}
    </Box>
  );
}
