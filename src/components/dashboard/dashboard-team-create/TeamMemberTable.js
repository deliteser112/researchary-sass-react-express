import PropTypes from 'prop-types';
import { filter } from 'lodash';
import React, { useEffect, useState } from 'react';

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

import TeamMemberMoreMenu from './TeamMemberMoreMenu';

TeamMemberTable.propTypes = {
  members: PropTypes.array,
  deleteProps: PropTypes.func
};

export default function TeamMemberTable({ members, deleteProps }) {
  const [addedMembers, setAddedMembers] = useState([]);

  useEffect(() => {
    setAddedMembers([...members]);
  }, [members]);

  const handleDeleteMember = (id) => {
    const oldMembers = addedMembers;
    const newMembers = filter(oldMembers, (member) => member.id !== id);
    setAddedMembers([...newMembers]);
    deleteProps([...newMembers]);
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
          {addedMembers.map((row, index) => (
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
                <TeamMemberMoreMenu
                  name={`${row.firstname} ${row.lastname}`}
                  deleteProps={handleDeleteMember}
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
