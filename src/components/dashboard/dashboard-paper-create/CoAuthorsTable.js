/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Stack,
  Avatar,
  Typography
} from '@material-ui/core';

// function createData(name, subName, rate, deadline, targeted) {
//   return { name, subName, rate, deadline, targeted };
// }

// const rows = [
//   createData('COMPSAC [2021]', 'Madrid - ES', 3, '15 Jul 2021', true),
//   createData('IEEE COINS 2021 [2021]', 'BARCELONA - ES', 2, '18 Dec 2020', false),
//   createData('ICBC [2021]', 'Sydney - AU', 3, '30 Apr 2021', false)
// ];

CoAuthorsTable.propTypes = {
  // dataProps: PropTypes.func,
  coAuthors: PropTypes.array
};

export default function CoAuthorsTable({ coAuthors }) {
  // const [targetedValue, setTargetedValue] = useState(0);
  // const [authors, setAuthors] = useState(coAuthors);

  // useEffect(() => {
  //   dataProps(targetedValue);
  // }, [targetedValue]);
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coAuthors.map((row, index) => (
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
                <Rating name="disabled" value={row.rate} max={3} readOnly />
              </TableCell>
              {/* <TableCell align="right">
                <ToggleButtonStyle
                  size="small"
                  value="check"
                  selected={row.targeted}
                  onChange={() => {
                    const tmpRow = conferences;
                    tmpRow.map((row) => {
                      row.targeted = false;
                    });
                    tmpRow[index].targeted = !row.targeted;
                    setConferences([...tmpRow]);
                    setTargetedValue(index);
                  }}
                >
                  <CheckIcon />
                </ToggleButtonStyle>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
