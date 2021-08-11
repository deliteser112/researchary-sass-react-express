import PropTypes from 'prop-types';
import React from 'react';

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

TeamMemberTable.propTypes = {
  members: PropTypes.array
};

export default function TeamMemberTable({ members }) {
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((row, index) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
