/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';

ConferenceTable.propTypes = {
  conferences: PropTypes.array
};

export default function ConferenceTable({ conferences }) {
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell align="right">Year</TableCell>
            <TableCell>Location</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
            <TableCell align="right">Submission Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conferences.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell align="right">{row.year}</TableCell>
              <TableCell>
                <Typography variant="subtitle1">{row.country.name}</Typography>
                <Typography variant="caption">{row.city}</Typography>
              </TableCell>
              <TableCell align="right">{row.startDate}</TableCell>
              <TableCell align="right">{row.endDate}</TableCell>
              <TableCell align="right">{row.submissionDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
