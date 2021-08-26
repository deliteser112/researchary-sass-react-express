/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
// material
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import { Container, Button, Grid, Typography, Box, ToggleButton, ToggleButtonGroup } from '@material-ui/core';

// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { CardTypeTeams, ListTypeTeams } from '../components/dashboard/dashboard-teams-overview';

// redux
import { useDispatch, useSelector } from '../redux/store';
import { getTeamList } from '../redux/slices/team';
// ----------------------------------------------------------------------

export default function TeamOverview() {
  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);
  const [viewType, setViewType] = useState('card');

  useEffect(() => {
    dispatch(getTeamList());
  }, [dispatch]);

  const handleViewType = (event, viewType) => {
    if (viewType !== null) {
      setViewType(viewType);
    }
  };
  return (
    <Page title="Overview | Researchary">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Teams"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Teams', href: PATH_DASHBOARD.teams.root },
            { name: 'Overview' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.teams.create}
              startIcon={<Icon icon={plusFill} />}
            >
              Add Teams
            </Button>
          }
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6">{teamList.length} team(s)</Typography>
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
              {teamList.map((item, index) => (
                <Grid key={index} item xs={12} md={6} lg={4} xl={3}>
                  <CardTypeTeams
                    teamId={item.id}
                    logoURL={item.logoURL}
                    name={item.name}
                    topics={item.topics}
                    members={item.members}
                  />
                </Grid>
              ))}
            </>
          )}
          {viewType === 'list' && (
            <Grid item xs={12}>
              <ListTypeTeams />
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
