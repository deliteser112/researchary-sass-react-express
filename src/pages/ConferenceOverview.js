/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
// material
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import { Container, Button, Grid, Typography, Box, ToggleButton, ToggleButtonGroup, Paper } from '@material-ui/core';

// redux
import { getConferenceList } from '../redux/slices/conference';
import { useDispatch, useSelector } from '../redux/store';

// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import {
  CardTypeConference,
  ListTypeConference,
  ConferenceSearchBar
} from '../components/dashboard/dashboard-conferences-overview';
import SearchNotFound from '../components/SearchNotFound';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export default function ConferenceOverview() {
  const dispatch = useDispatch();
  const { conferenceList } = useSelector((state) => state.conference);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');

  const [viewType, setViewType] = useState('card');
  const [conferences, setConferences] = useState([]);

  const [filterName, setFilterName] = useState('');
  const [filterCountry, setFilterCountry] = useState(null);
  const [filterRating, setFilterRating] = useState('');

  useEffect(() => {
    dispatch(getConferenceList());
  }, [dispatch]);

  useEffect(() => {
    setOrder('asc');
    setOrderBy('title');
  }, [order, orderBy]);

  useEffect(() => {
    const tmpConfList = [];
    conferenceList.map((conf) => {
      const { id, score, logoURL, name, versions, dueDate, topics, toSubmit, underReview, published } = conf;
      let location = {};
      if (versions.length > 0) {
        const { country, city } = versions[versions.length - 1];
        location = { country: country.name, city };
      } else {
        location = { country: 'No', city: 'versions' };
      }
      tmpConfList.push({
        id,
        rate: score,
        logoURL,
        title: name,
        location,
        dueDate,
        topics,
        toSubmit,
        underReview,
        published
      });
    });
    setConferences([...tmpConfList]);
  }, [conferenceList]);

  const handleViewType = (event, viewType) => {
    if (viewType !== null) {
      setViewType(viewType);
    }
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

  const filteredUsers = applySortFilter(conferences, getComparator(order, orderBy), filterName);
  const filteredCountry = applySortFilterByCountry(
    filteredUsers,
    getComparator(order, orderBy),
    filterCountry === null ? null : filterCountry.name
  );
  const filteredRating = applySortFilterByRating(filteredCountry, getComparator(order, orderBy), filterRating);

  const isConferenceNotFound = filteredUsers.length === 0;

  return (
    <Page title="Overview | Researchary">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Conferences"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Conferences', href: PATH_DASHBOARD.conferences.root },
            { name: 'Overview' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.conferences.create}
              startIcon={<Icon icon={plusFill} />}
            >
              Add Conference
            </Button>
          }
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6">{conferences.length} conference(s)</Typography>
          <ToggleButtonGroup value={viewType} exclusive onChange={handleViewType} aria-label="View Type">
            <ToggleButton value="card" aria-label="Card View">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="List View">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box m={2} />
        {viewType === 'card' && (
          <Paper elevation={3}>
            <ConferenceSearchBar
              filterName={filterName}
              filterCountry={filterCountry}
              filterRating={filterRating}
              onFilterName={handleFilterByName}
              onFilterCountry={handleFilterByCountry}
              onFilterRating={handleFilterByRating}
            />
          </Paper>
        )}
        <Box m={5} />
        <Grid container spacing={3}>
          {viewType === 'card' && (
            <>
              {filteredRating.map((item, index) => (
                <Grid key={index} item xs={12} md={6} lg={4} xl={3}>
                  <CardTypeConference
                    confId={item.id}
                    rate={item.rate}
                    logoURL={item.logoURL}
                    title={item.title}
                    flagURL={item.flagURL}
                    country={item.location.country}
                    city={item.location.city}
                    date={item.dueDate}
                    topics={item.topics}
                    toSubmit={item.toSubmit}
                    underReview={item.underReview}
                    published={item.published}
                  />
                </Grid>
              ))}
            </>
          )}
          {viewType === 'list' && (
            <Grid item xs={12}>
              <ListTypeConference conferences={conferences} />
            </Grid>
          )}
          {isConferenceNotFound && (
            <Grid item align="center" xs={12} sx={{ py: 3 }}>
              <SearchNotFound searchQuery={filterName} />
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
