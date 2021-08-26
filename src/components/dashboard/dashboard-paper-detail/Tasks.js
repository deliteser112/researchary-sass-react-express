/* eslint-disable array-callback-return */
// import { filter } from 'lodash';
import PropTypes from 'prop-types';

import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Box,
  TableContainer,
  TablePagination,
  Typography
} from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { deleteTask } from '../../../redux/slices/paper';
// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';
import SearchNotFound from '../../SearchNotFound';
import TaskListHead from './TaskListHead';
import TaskListToolbar from './TaskListToolbar';
import TaskMoreMenu from './TaskMoreMenu';
import AddTask from './AddTask';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'task', label: 'TASK', alignRight: false },
  { id: 'createdby', label: 'CREATED BY', alignRight: false },
  { id: 'assinedby', label: 'ASSIGNED BY', alignRight: false },
  { id: 'status', label: 'STATUS', alignRight: false },
  { id: 'date', label: 'DUE DATE', alignRight: false },
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
    return array.filter((_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function applySortFilterByStatus(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_paper) => _paper.status.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

Tasks.propTypes = {
  currentPaper: PropTypes.object
};

export default function Tasks({ currentPaper }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { taskList } = useSelector((state) => state.paper);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState('');

  const [authors, setAuthors] = useState([]);
  const [paperId, setPaperId] = useState(0);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // dispatch(getTaskList());
  }, [dispatch]);

  useEffect(() => {
    if (taskList.length > 0 && paperId > 0) {
      const tasks = [];
      taskList.map((task) => {
        if (task.paperId === paperId) {
          tasks.push(task);
        }
      });
      setTasks([...tasks]);
    }
  }, [taskList, paperId]);

  useEffect(() => {
    if (currentPaper !== undefined) {
      const { id, authors } = currentPaper;
      setPaperId(id);
      setAuthors([...authors]);
    }
  }, [currentPaper]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tasks.map((n) => n.id);
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

  const handleDeleteUser = (userId) => {
    dispatch(deleteTask(userId));
  };

  const handleFilterByStatus = (status) => {
    setFilterStatus(status);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;

  const filteredUsers = applySortFilter(tasks, getComparator(order, orderBy), filterName);
  const filteredPapers = applySortFilterByStatus(filteredUsers, getComparator(order, orderBy), filterStatus);

  const isUserNotFound = filteredPapers.length === 0;

  return (
    <>
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <AddTask paperId={paperId} authors={authors} isEdit={false} />
      </Box>
      <Card>
        <TaskListToolbar
          numSelected={selected.length}
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterByName}
          onFilterStatus={handleFilterByStatus}
        />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TaskListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tasks.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredPapers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, title, createdby, assignedby, status, dueDate } = row;
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
                        {title}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={`${createdby.firstname} ${createdby.lastname}`} src={createdby.photoURL} />
                          <Typography variant="subtitle2" noWrap>
                            {`${createdby.firstname} ${createdby.lastname}`}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={`${assignedby.firstname} ${assignedby.lastname}`} src={assignedby.photoURL} />
                          <Typography variant="subtitle2" noWrap>
                            {`${assignedby.firstname} ${assignedby.lastname}`}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={
                            (status === 'Completed' && 'success') ||
                            (status === 'In progress' && 'secondary') ||
                            'secondary'
                          }
                        >
                          {sentenceCase(status)}
                        </Label>
                      </TableCell>
                      <TableCell align="left">
                        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>{dueDate}</Label>
                      </TableCell>

                      <TableCell align="right">
                        <TaskMoreMenu
                          onDelete={() => handleDeleteUser(id)}
                          taskId={id}
                          paperId={paperId}
                          authors={authors}
                        />
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
              {isUserNotFound && (
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
          count={taskList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
