import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@material-ui/core/styles';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

// component
import ConferneceTable from './ConferencesTable';
import JournalsTable from './JournalsTable';
import WorkshopsTable from './WorkshopsTable';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 1, px: 0.1 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

TargetPaperForm.propTypes = {
  currentPaper: PropTypes.object,
  isEdit: PropTypes.bool,
  conference: PropTypes.array,
  targetFormProps: PropTypes.func
};

export default function TargetPaperForm({ currentPaper, isEdit, conference, targetFormProps }) {
  const [value, setValue] = useState(0);
  const [target, setTarget] = useState(0);

  const [confTitle, setConfTitle] = useState('');

  const theme = useTheme();

  useEffect(() => {
    if (isEdit && currentPaper !== undefined) {
      const { target } = currentPaper;
      setTarget(target);
    }
  }, [currentPaper, isEdit]);

  useEffect(() => {
    setConfTitle(`Conferences (${conference.length})`);
  }, [conference]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleConference = (data) => {
    targetFormProps(data);
  };

  return (
    <Box sx={{ width: '100%', padding: theme.spacing(0) }}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
        <Tab label={confTitle} {...a11yProps(0)} />
        <Tab label="Workshops (0)" {...a11yProps(1)} />
        <Tab label="Journals (0)" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ConferneceTable target={target.id} isEdit={isEdit} conferenceTable={conference} dataProps={handleConference} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <WorkshopsTable />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <JournalsTable />
      </TabPanel>
    </Box>
  );
}
