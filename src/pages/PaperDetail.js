/* eslint-disable array-callback-return */
import { useTheme } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TimelineIcon from '@material-ui/icons/Timeline';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import FeedbackIcon from '@material-ui/icons/Feedback';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import LinkIcon from '@material-ui/icons/Link';
import GroupIcon from '@material-ui/icons/Group';

// material
import { Container, Tab, Box, Tabs, Stack, Typography, Avatar, Tooltip, AvatarGroup } from '@material-ui/core';

// hooks
import usePaper from '../hooks/usePaper';
// redux
import { getPaperList, getTopics } from '../redux/slices/paper';
import { useDispatch, useSelector } from '../redux/store';
// components
import Page from '../components/Page';
import Label from '../components/Label';

import { Details, Tasks, Files, Timeline, Comments, Authors } from '../components/dashboard/dashboard-paper-detail';
// ----------------------------------------------------------------------

export default function UserAccount() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { paperList, topics } = useSelector((state) => state.paper);
  const { updateStatus } = usePaper();
  const { paperId } = useParams();
  const currentPaper = paperList.find((paper) => paper.id === Number(paperId));

  const [currentTab, setCurrentTab] = useState('details');
  const [status, setStatus] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [authors, setAuthors] = useState([]);

  const [detailTopics, setDetailTopics] = useState([]);

  const [propTopics, setPropTopics] = useState([]);

  const [pId, setPaperId] = useState(0);

  useEffect(() => {
    dispatch(getTopics());
    dispatch(getPaperList());
  }, [dispatch]);

  useEffect(() => {
    setStatus('Not started');
  }, []);

  useEffect(() => {
    setDetailTopics([...topics]);
  }, [topics]);

  useEffect(() => {
    if (currentPaper !== undefined) {
      const { id, title, authors, status, topics } = currentPaper;
      setPaperTitle(title);
      setAuthors([...authors]);
      setStatus(status);
      setPaperId(id);
      const propsTopics = [];
      detailTopics.map((dTopic) => {
        topics.map((top) => {
          if (top === dTopic.id) {
            propsTopics.push(dTopic);
          }
        });
      });
      setPropTopics([...propsTopics]);
    }
  }, [currentPaper, detailTopics]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleStatus = (statusId) => {
    setStatus(STATUSES[statusId]);
    const statusData = { pId, statusId };
    updateStatus({ statusData });
  };

  const handleAuthorChange = () => {
    setTimeout(() => {
      dispatch(getPaperList());
    }, 1000);
  };

  const ACCOUNT_TABS = [
    {
      value: 'details',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <Details currentPaper={currentPaper} propTopics={propTopics} statusProps={handleStatus} />
    },
    {
      value: 'tasks',
      icon: <PlaylistAddCheckIcon />,
      component: <Tasks currentPaper={currentPaper} />
    },
    {
      value: 'files',
      icon: <AttachFileIcon />,
      component: <Files currentPaper={currentPaper} />
    },
    {
      value: 'comments',
      icon: <FeedbackIcon />,
      component: <Comments currentPaper={currentPaper} />
    },
    {
      value: 'link',
      icon: <LinkIcon />,
      component: 'Links page is coming soon'
    },
    {
      value: 'authors',
      icon: <GroupIcon />,
      component: <Authors onAuthorChange={handleAuthorChange} currentPaper={currentPaper} />
    },
    {
      value: 'timeline',
      icon: <TimelineIcon />,
      component: <Timeline currentPaper={currentPaper} />
    }
  ];

  return (
    <Page title="Paper Detail | Researchary">
      <Container maxWidth="xl">
        <Box
          sx={{ display: 'block', [theme.breakpoints.up('sm')]: { display: 'flex', justifyContent: 'space-between' } }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {paperTitle}
            </Typography>
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={
                (status === 'Not started' && 'default') ||
                (status === 'In progress' && 'secondary') ||
                (status === 'Blocked/On Hold' && 'error') ||
                (status === 'Ready to submit' && 'info') ||
                (status === 'Submitted/Under review' && 'warning') ||
                (status === 'Rejected' && 'error') ||
                (status === 'Accepted' && 'primary') ||
                'success'
              }
            >
              {status}
            </Label>
          </Box>
          <Box>
            <Typography variant="caption">CO-AUTHORS:</Typography>
            <AvatarGroup max={4} sx={{ [theme.breakpoints.down('sm')]: { justifyContent: 'flex-end' } }}>
              {authors.map((author, index) => (
                <Tooltip key={index} title={`${author.firstname} ${author.lastname}`} placement="top">
                  <Avatar alt={author.name} src={author.photoURL} />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        </Box>
        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Container>
    </Page>
  );
}

const STATUSES = [
  'Not started',
  'In progress',
  'Blocked/On Hold',
  'Ready to submit',
  'Submitted/Under review',
  'Rejected',
  'Accepted',
  'Published'
];
