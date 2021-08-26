// import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import BusinessIcon from '@material-ui/icons/Business';
// material
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  AvatarGroup,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Tooltip,
  Box,
  Typography
} from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getTeamList, deleteTeam } from '../../../redux/slices/team';

// components
import Scrollbar from '../../Scrollbar';
import SearchNotFound from '../../SearchNotFound';

import TeamListHead from './TeamListHead';
import TeamListToolbar from './TeamListToolbar';
import TeamMoreMenu from './TeamMoreMenu';

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
  { id: 'name', label: 'Team Name', alignRight: false },
  { id: 'university', label: 'University', alignRight: false },
  { id: 'topics', label: 'Research Areas', alignRight: false },
  { id: 'members', label: 'Members', alignRight: false },
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
  const { teamList } = useSelector((state) => state.team);
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
      const newSelecteds = teamList.map((n) => n.id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - teamList.length) : 0;

  const filteredUsers = applySortFilter(teamList, getComparator(order, orderBy), filterName);

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
              rowCount={teamList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const { id, name, logoURL, members, topics } = row;
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
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <BusinessIcon sx={{ mr: 1, width: 20, height: 20 }} />
                        <Typography variant="caption">Edinburgh Niper University</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ textAlign: 'center' }}>
                        {topics.map((item, index) => (
                          <ChipButton key={index} variant="outlined">
                            {item.name}
                          </ChipButton>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <AvatarGroup max={3}>
                          {members.map((member, index) => (
                            <Tooltip key={index} title={`${member.firstname} ${member.lastname}`} placement="top">
                              <Avatar alt={member.firstname} src={member.photoURL} />
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <TeamMoreMenu onDelete={() => handleDeleteTeam(id)} teamId={id} />
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
        count={teamList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
