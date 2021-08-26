import PropTypes from 'prop-types';
// import { filter } from 'lodash';
import { useState } from 'react';
// material
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Box,
  Rating
} from '@material-ui/core';
// redux
import { useDispatch } from '../../../redux/store';
import { deleteConference } from '../../../redux/slices/conference';

// components
import Scrollbar from '../../Scrollbar';
import SearchNotFound from '../../SearchNotFound';

import ConferenceListHead from './ConferenceListHead';
import ConferenceListToolbar from './ConferenceListToolbar';
import ConferenceMoreMenu from './ConferenceMoreMenu';

// ----------------------------------------------------------------------

const ChipButton = withStyles((theme) => ({
  root: {
    fontWeight: 100,
    fontSize: 11,
    padding: theme.spacing(0.2, 1),
    borderRadius: 3,
    marginRight: 5,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white'
    }
  }
}))(Button);

const TABLE_HEAD = [
  { id: 'logo', label: 'Logo', alignRight: false },
  { id: 'name', label: 'Conference Name', alignRight: false },
  { id: 'topics', label: 'Research Areas', alignRight: false },
  { id: 'country', label: 'Country', alignRight: false },
  { id: 'rate', label: 'Rate', alignRight: false },
  { id: 'dueDate', label: 'Due Date', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_conf) => _conf.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function applySortFilterByCountry(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_conf) => _conf.location.country.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function applySortFilterByRating(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_conf) => _conf.rate.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

ListTypeConference.propTypes = {
  conferences: PropTypes.array
};

export default function ListTypeConference({ conferences }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [filterName, setFilterName] = useState('');
  const [filterCountry, setFilterCountry] = useState(null);
  const [filterRating, setFilterRating] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = conferences.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, title) => {
    const selectedIndex = selected.indexOf(title);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, title);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterByCountry = (event) => {
    setFilterCountry(event);
  };

  const handleFilterByRating = (event) => {
    setFilterRating(event.target.value);
  };

  const handleDeleteConference = (confId) => {
    dispatch(deleteConference(confId));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - conferences.length) : 0;

  const filteredUsers = applySortFilter(conferences, getComparator(order, orderBy), filterName);
  const filteredCountry = applySortFilterByCountry(
    filteredUsers,
    getComparator(order, orderBy),
    filterCountry === null ? null : filterCountry.name
  );
  const filteredRating = applySortFilterByRating(filteredCountry, getComparator(order, orderBy), filterRating);

  const isConferenceNotFound = filteredUsers.length === 0;

  return (
    <Card>
      <ConferenceListToolbar
        numSelected={selected.length}
        filterName={filterName}
        filterCountry={filterCountry}
        filterRating={filterRating}
        onFilterName={handleFilterByName}
        onFilterCountry={handleFilterByCountry}
        onFilterRating={handleFilterByRating}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <ConferenceListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={conferences.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredRating.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const { id, title, logoURL, dueDate, location, topics, rate } = row;
                const isItemSelected = selected.indexOf(id) !== -1;

                return (
                  <TableRow
                    hover
                    key={id}
                    tabIndex={-1}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                    </TableCell>
                    <TableCell align="left" sx={{ maxWidth: '300px' }}>
                      <Avatar alt={logoURL} src={logoURL} />
                    </TableCell>
                    <TableCell align="left" sx={{ maxWidth: '300px' }}>
                      {title}
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ textAlign: 'left' }}>
                        {topics.map((item, index) => (
                          <ChipButton key={index} variant="outlined">
                            {item.name}
                          </ChipButton>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="left" sx={{ maxWidth: '300px' }}>
                      {location.country} - {location.city}
                    </TableCell>
                    <TableCell align="left" sx={{ maxWidth: '300px' }}>
                      <Rating name="read-only" size="small" max={3} value={rate !== undefined ? rate : 0} readOnly />
                    </TableCell>
                    <TableCell align="left" sx={{ maxWidth: '300px' }}>
                      {dueDate}
                    </TableCell>
                    <TableCell align="right">
                      <ConferenceMoreMenu onDelete={() => handleDeleteConference(id)} confId={id} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {isConferenceNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={conferences.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
