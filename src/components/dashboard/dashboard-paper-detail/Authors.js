/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';

import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { TextField, Box, Button, Typography, Autocomplete } from '@material-ui/core';

// hooks
import usePaper from '../../../hooks/usePaper';

// redux
import { getUsers } from '../../../redux/slices/user';
import { useDispatch, useSelector } from '../../../redux/store';

import CoAuthorsTable from './CoAuthorsTable';
import HasErrorDialog from '../../HasErrorDialog';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: '98%'
  }
}));

Authors.propTypes = {
  currentPaper: PropTypes.object,
  onAuthorChange: PropTypes.func
};

export default function Authors({ onAuthorChange, currentPaper }) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { setAuthor } = usePaper();

  const { users } = useSelector((state) => state.user);

  const [authors, setAuthors] = useState([]);
  const [coAuthors, setCoAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const [isAdded, setIsAdded] = useState(false);
  const [errorContent, setErrorContent] = useState('');

  const [paperId, setPaperId] = useState(0);
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    setCoAuthors([...users]);
  }, [users]);

  useEffect(() => {
    const { authors, id } = currentPaper;
    setAuthors([...authors]); // table
    setPaperId(id);
  }, [currentPaper]);

  const handleAuthors = (author) => {
    setSelectedAuthor(author);
  };

  const handleClickAddCoAuthors = async () => {
    const oldAuthors = authors;
    let isAdded = false;
    authors.map((author) => {
      if (author.email === selectedAuthor.email) {
        isAdded = true;
      }
    });

    if (!isAdded) {
      oldAuthors.push(selectedAuthor);
      setAuthors([...oldAuthors]);
      const data = { paperId, authors: oldAuthors };
      await setAuthor({ data }); // database resets,,,, this is not state
      onAuthorChange();
    } else {
      setIsAdded(true);
      setErrorContent('This author was already added!');
    }
  };

  const handleHasError = () => {
    setIsAdded(false);
  };

  const handleDeleteProps = async (newAuthors) => {
    const data = { paperId, authors: newAuthors };
    await setAuthor({ data }); // database resets,,,, this is not state
    onAuthorChange();
    setAuthors([...newAuthors]);
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ pl: 2 }}>
        You can invite one or more authors to join your paper
      </Typography>
      <Box m={3} />
      <Box sx={{ display: 'block', my: 2, [theme.breakpoints.up('md')]: { display: 'flex', alignItems: 'center' } }}>
        <Autocomplete
          id="tags-outlined"
          options={coAuthors}
          getOptionLabel={(option) => option.email}
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
      {authors.length > 0 && (
        <>
          <CoAuthorsTable coAuthors={authors} deleteProps={handleDeleteProps} />
          <HasErrorDialog errorContent={errorContent} hasError={isAdded} errorProps={handleHasError} />
        </>
      )}
    </Box>
  );
}
