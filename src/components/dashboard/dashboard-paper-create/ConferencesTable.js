/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { withStyles } from '@material-ui/core/styles';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Rating,
  ToggleButton
} from '@material-ui/core';
// import CheckIcon from '@material-ui/icons/Check';

// function createData(name, subName, rate, deadline, targeted) {
//   return { name, subName, rate, deadline, targeted };
// }

// const rows = [
//   createData('COMPSAC [2021]', 'Madrid - ES', 3, '15 Jul 2021', true),
//   createData('IEEE COINS 2021 [2021]', 'BARCELONA - ES', 2, '18 Dec 2020', false),
//   createData('ICBC [2021]', 'Sydney - AU', 3, '30 Apr 2021', false)
// ];

const ToggleButtonStyle = withStyles((theme) => ({
  root: {
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.primary.main
      }
    }
  }
}))(ToggleButton);

ConferencesTable.propTypes = {
  target: PropTypes.number,
  conferenceTable: PropTypes.array,
  dataProps: PropTypes.func
};

export default function ConferencesTable({ target, conferenceTable, dataProps }) {
  const [targetedValue, setTargetedValue] = useState(target);
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    dataProps(targetedValue);
  }, [targetedValue]);

  useEffect(() => {
    if (conferenceTable.length > 0) {
      const tmpConference = [];
      conferenceTable.map((conference) => {
        if (conference.id === target) {
          tmpConference.push({ ...conference, targeted: true });
        } else {
          tmpConference.push(conference);
        }
      });
      setConferences([...tmpConference]);
    }
  }, [conferenceTable, target]);
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Conference Name</TableCell>
            <TableCell align="right">Rate</TableCell>
            <TableCell align="right">Deadline</TableCell>
            <TableCell align="right">Targeted</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conferences.map((row, index) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Typography variant="subtitle1">{row.name}</Typography>
                {/* <Typography variant="caption">{row.subName}</Typography> */}
                <Typography variant="caption">MADRID-ES</Typography>
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
                    const tmpRow = conferences;
                    tmpRow.map((row) => {
                      row.targeted = false;
                    });
                    tmpRow[index].targeted = !row.targeted;
                    setConferences([...tmpRow]);
                    setTargetedValue(row.id);
                  }}
                >
                  {row.targeted ? 'Targeted' : 'Target'}
                  {/* <CheckIcon /> */}
                </ToggleButtonStyle>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
