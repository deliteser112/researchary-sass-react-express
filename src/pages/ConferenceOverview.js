import React, { useState, useEffect } from 'react';
// material
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import { Container, Button, Grid, Typography, Box, ToggleButton, ToggleButtonGroup } from '@material-ui/core';

// redux
import { getConferenceList } from '../redux/slices/conference';
import { useDispatch, useSelector } from '../redux/store';

// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { CardTypeConference, ListTypeConference } from '../components/dashboard/dashboard-conferences-overview';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ConferenceOverview() {
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState('card');
  const [conferences, setConferences] = useState([]);
  const { conferenceList } = useSelector((state) => state.conference);

  useEffect(() => {
    dispatch(getConferenceList());
  }, [dispatch]);

  useEffect(() => {
    setConferences(conferenceList);
  }, [conferenceList]);

  const handleViewType = (event, viewType) => {
    if (viewType !== null) {
      setViewType(viewType);
    }
  };
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
        <Box m={5} />
        <Grid container spacing={3}>
          {viewType === 'card' && (
            <>
              {conferences.map((item, index) => (
                <Grid key={index} item xs={12} md={6} lg={4} xl={3}>
                  <CardTypeConference
                    confId={item.id}
                    rate={item.score}
                    logoURL={item.logoURL}
                    title={item.name}
                    flagURL={item.flagURL}
                    country={item.country}
                    date={item.dueDate}
                    categories={item.topics}
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
              <ListTypeConference />
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
