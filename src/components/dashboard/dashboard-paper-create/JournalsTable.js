import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Rating,
  Box,
  ToggleButton
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

// function createData(name, subName, rate, deadline, targeted) {
//   return { name, subName, rate, deadline, targeted };
// }

// const rows = [createData('ICBC [2021]', 'Sydney - AU', 3, '30 Apr 2021', false)];
const rows = [];

const ToggleButtonStyle = withStyles({
  root: {
    backgroundColor: 'white',
    border: '1px solid #00AB55',
    color: '#00AB55',
    '&.Mui-selected': {
      backgroundColor: '#00AB55',
      color: 'white',
      '&:hover': {
        backgroundColor: '#00AB77'
      }
    }
  }
})(ToggleButton);

export default function JournalsTable() {
  const [selected, setSelected] = React.useState(false);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Journal Name</TableCell>
            <TableCell align="right">Rate</TableCell>
            <TableCell align="right">Issue Deadline</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Typography variant="subtitle1">{row.name}</Typography>
                <Typography variant="caption">{row.subName}</Typography>
              </TableCell>
              <TableCell align="right">
                <Rating name="disabled" value={row.rate} max={3} readOnly />
              </TableCell>
              <TableCell align="right">{row.deadline}</TableCell>
              <TableCell align="right">
                <ToggleButtonStyle
                  size="small"
                  value="check"
                  selected={row.targeted}
                  onChange={() => {
                    setSelected(!selected);
                  }}
                >
                  {!row.targeted ? (
                    <Typography variant="body1">Target</Typography>
                  ) : (
                    <Box sx={{ display: 'flex' }}>
                      <CheckIcon sx={{ mr: 1 }} />
                      <Typography variant="body1">Targeted</Typography>
                    </Box>
                  )}
                </ToggleButtonStyle>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
