import React, { useState } from 'react';
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
import { CardTypeJournals, ListTypeJournals } from '../components/dashboard/dashboard-journals-overview';
// ----------------------------------------------------------------------

const journals = [
  {
    id: 0,
    rate: 2,
    logoURL: '/static/components/journals_logo1.jpg',
    title: 'Journal of Heuristics',
    flagURL: '/static/components/es.svg',
    country: 'Spain - Madrid',
    date: '03 Apr 2019',
    categories: ['Information Society', 'Blockchain', 'Cybersecurity'],
    toSubmit: 2,
    underReview: 3,
    published: 0
  },
  {
    id: 1,
    rate: 3,
    logoURL: '/static/components/company2.jpg',
    title: 'Blockchain and Cryptocurrency',
    flagURL: '/static/components/gb.svg',
    country: 'United Kingdom - London',
    date: '12 Oct 2021',
    categories: ['Software engineering', 'Ubiquitous computing'],
    toSubmit: 0,
    underReview: 2,
    published: 1
  },
  {
    id: 2,
    rate: 3,
    logoURL: '/static/components/company3.jpg',
    title: 'Evolutionary Computation',
    flagURL: '/static/components/pl.svg',
    country: 'Poland - Warsaw',
    date: '19 Set 2020',
    categories: ['Networks', 'Mobile computing', 'Secure coding'],
    toSubmit: 1,
    underReview: 0,
    published: 0
  }
];

// ----------------------------------------------------------------------

export default function JournalsOverview() {
  const [viewType, setViewType] = useState('card');

  const handleViewType = (event, viewType) => {
    setViewType(viewType);
  };
  return (
    <Page title="Overview | Researchary">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Journals"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Journals', href: PATH_DASHBOARD.journals.root },
            { name: 'Overview' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.journals.add}
              startIcon={<Icon icon={plusFill} />}
            >
              Add Journals
            </Button>
          }
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6">3 journal(s)</Typography>
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
              {journals.map((item, index) => (
                <Grid key={index} item xs={12} md={6} lg={4}>
                  <CardTypeJournals
                    rate={item.rate}
                    logoURL={item.logoURL}
                    title={item.title}
                    flagURL={item.flagURL}
                    country={item.country}
                    date={item.date}
                    categories={item.categories}
                    toSubmit={item.toSubmit}
                    underReview={item.underReview}
                    published={item.published}
                  />
                </Grid>
              ))}
            </>
          )}
          {viewType === 'list' && (
            <>
              {journals.map((item, index) => (
                <Grid key={index} item xs={12}>
                  <ListTypeJournals
                    rate={item.rate}
                    logoURL={item.logoURL}
                    title={item.title}
                    flagURL={item.flagURL}
                    country={item.country}
                    date={item.date}
                    categories={item.categories}
                  />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
