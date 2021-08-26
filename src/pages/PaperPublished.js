// import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@material-ui/core/styles';
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
  Container,
  TableContainer,
  TablePagination,
  Tooltip,
  Typography
} from '@material-ui/core';
// import AvatarGroup from '@material-ui/lab/AvatarGroup';

// hooks
import usePaper from '../hooks/usePaper';
// redux
import { useDispatch, useSelector } from '../redux/store';
import { getPublishedList, deletePublished } from '../redux/slices/paper';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { PaperListHead, PaperListToolbar, PaperMoreMenu } from '../components/dashboard/dashboard-paper-overview';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'PAPER TITLE', alignRight: false },
  { id: 'authors', label: 'AUTHORS', alignRight: false },
  { id: 'status', label: 'STATUS', alignRight: false },
  { id: 'target', label: 'TARGET', alignRight: false },
  { id: 'date', label: 'DUE DATE', alignRight: false },
  { id: 'attached', label: '', alignRight: false },
  { id: 'view', label: '', alignRight: false },
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

export default function UserList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { deletePaperPost } = usePaper();
  const { publishedList } = useSelector((state) => state.paper);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getPublishedList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = publishedList.map((n) => n.id);
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

  const handleDeletePaper = (paperId) => {
    const pId = { paperId };
    deletePaperPost({ pId });
    dispatch(deletePublished(paperId));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - publishedList.length) : 0;

  const filteredUsers = applySortFilter(publishedList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Published | Researchary">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="My Papers"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'My Papers', href: PATH_DASHBOARD.papers.root },
            { name: 'Published' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.papers.create}
              startIcon={<Icon icon={plusFill} />}
            >
              Add Paper
            </Button>
          }
        />

        <Card>
          <PaperListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            isPublished
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <PaperListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={publishedList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, title, authors, status, target, dueDate, attached, view } = row;
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
                            <AvatarGroup max={4}>
                              {authors.map((author, index) => (
                                <Tooltip key={index} title={`${author.firstname} ${author.lastname}`} placement="top">
                                  <Avatar alt={author.firstname} src={author.photoURL} />
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'Published' && 'success') || 'secondary'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>
                        <TableCell align="left">
                          {target.id !== null && (
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={target.logoURL} src={target.logoURL} />
                              <Typography variant="subtitle2" noWrap>
                                {target.name}
                              </Typography>
                            </Stack>
                          )}
                        </TableCell>
                        <TableCell align="left">
                          <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>{dueDate}</Label>
                        </TableCell>
                        <TableCell align="left">{attached}</TableCell>
                        <TableCell align="left">{view}</TableCell>

                        <TableCell align="right">
                          <PaperMoreMenu
                            onDelete={(paperId) => handleDeletePaper(paperId)}
                            paperId={id}
                            authors={authors}
                            paperName={title}
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
            count={publishedList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
