// import { filter } from 'lodash';
import { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from '../../../redux/store';
import { getTeamList, deleteTeam } from '../../../redux/slices/team';

// components
import Scrollbar from '../../Scrollbar';
import SearchNotFound from '../../SearchNotFound';

import TeamListHead from './ConferenceListHead';
import TeamListToolbar from './ConferenceListToolbar';
import TeamMoreMenu from './ConferenceTeamMoreMenu';

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
    return array.filter((_team) => _team.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ListTypeTeam() {
  const dispatch = useDispatch();
  // const { conferenceList } = useSelector((state) => state.team);
  const { conferenceList } = useSelector((state) => state.conference);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getTeamList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = conferenceList.map((n) => n.id);
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

  const handleDeleteTeam = (teamId) => {
    dispatch(deleteTeam(teamId));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - conferenceList.length) : 0;

  const filteredUsers = applySortFilter(conferenceList, getComparator(order, orderBy), filterName);

  const isTeamNotFound = filteredUsers.length === 0;

  return (
    <Card>
      <TeamListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TeamListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={conferenceList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const { id, name, logoURL, dueDate, topics, score } = row;
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
                      {name}
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ textAlign: 'left' }}>
                        {topics.map((item, index) => (
                          <ChipButton key={index} variant="outlined">
                            {item}
                          </ChipButton>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="left" sx={{ maxWidth: '300px' }}>
                      <Rating name="read-only" size="small" max={3} value={score !== undefined ? score : 0} readOnly />
                    </TableCell>
                    <TableCell align="left" sx={{ maxWidth: '300px' }}>
                      {dueDate}
                    </TableCell>
                    <TableCell align="right">
                      <TeamMoreMenu onDelete={() => handleDeleteTeam(id)} confId={id} />
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
            {isTeamNotFound && (
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
        count={conferenceList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
