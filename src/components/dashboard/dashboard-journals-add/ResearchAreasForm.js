import * as React from 'react';

import TextField from '@material-ui/core/TextField';

import { Grid, Box, Autocomplete } from '@material-ui/core';

export default function ResearchAreasForm() {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Autocomplete
            limitTags={2}
            multiple
            id="multiple-limit-tags"
            options={teams}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Share this journal with your teams" />
            )}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Autocomplete
            multiple
            id="multiple-limit-tags"
            options={topics}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select at least one research area"
                placeholder="Enter main topics the..."
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

const teams = [
  'Data Science and Cyber Analytics (DSCA) Research Group',
  'Intelligence-Driven Software Engineering Group',
  'Cybersecurity and Digital Identity Group',
  'Distributed Computing Networking and Security'
];

const topics = ['Research Group', 'Intelligence', 'Digital Identity Group', 'Security'];
