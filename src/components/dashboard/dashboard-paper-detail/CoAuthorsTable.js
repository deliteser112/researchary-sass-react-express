/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Avatar,
  Typography
} from '@material-ui/core';

import AuthorMoreMenu from './AuthorMoreMenu';

CoAuthorsTable.propTypes = {
  coAuthors: PropTypes.array,
  deleteProps: PropTypes.func
};

export default function CoAuthorsTable({ coAuthors, deleteProps }) {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    setAuthors([...coAuthors]);
  }, [coAuthors]);

  const handleDeleteAuthor = (id) => {
    const oldAuthors = authors;
    const newAuthors = filter(oldAuthors, (author) => author.id !== id);
    setAuthors([...newAuthors]);
    deleteProps([...newAuthors]);
  };

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {authors.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell align="left">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar alt={row.firstname} src={row.photoURL} />
                  <Typography variant="subtitle2" noWrap>
                    {row.firstname} {row.lastname}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">
                <AuthorMoreMenu
                  name={`${row.firstname} ${row.lastname}`}
                  deleteProps={handleDeleteAuthor}
                  deleteId={row.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
