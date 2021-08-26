/* eslint-disable react/prop-types */
/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';

import { useTheme } from '@material-ui/core/styles';
// material
import { Paper, Typography, Avatar, Box } from '@material-ui/core';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineOppositeContent
} from '@material-ui/lab';

// redux
import { getTimelineList } from '../../../redux/slices/paper';
import { useDispatch, useSelector } from '../../../redux/store';

import Label from '../../Label';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

TimelineComponent.propTyps = {
  currentPaper: PropTypes.object
};

export default function TimelineComponent({ currentPaper }) {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { timelineList } = useSelector((state) => state.paper);

  const [pId, setPaperId] = useState(0);

  const [timelines, setTimelines] = useState([]);

  useEffect(() => {
    dispatch(getTimelineList());
  }, [dispatch]);

  useEffect(() => {
    if (currentPaper !== undefined) {
      const { id } = currentPaper;
      setPaperId(id);
    }
  }, [currentPaper]);

  useEffect(() => {
    if (timelineList.length > 0 && pId !== 0) {
      const tmpTimelines = [];
      timelineList.map((timeline) => {
        const { paperId } = timeline;
        if (pId === paperId) {
          tmpTimelines.push(timeline);
        }
      });
      setTimelines([...tmpTimelines]);
    }
  }, [pId, timelineList]);

  return (
    <Timeline position="alternate">
      {timelines.map((item, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.updatedDay}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator sx={{ height: 200 }}>
            <Avatar
              alt={item.name}
              src={item.photoURL}
              sx={{ width: theme.spacing(7), height: theme.spacing(7), margin: '10px' }}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper
              sx={{
                p: 3,
                bgcolor: 'grey.50012'
              }}
            >
              <Typography variant="subtitle2">{item.name}</Typography>
              <Box m={1} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {item.eventText}
              </Typography>
              <Box m={2} />
              {!!item.isStatus && (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={
                    (item.status === 'Not started' && 'default') ||
                    (item.status === 'In progress' && 'secondary') ||
                    (item.status === 'Blocked/On Hold' && 'error') ||
                    (item.status === 'Ready to submit' && 'info') ||
                    (item.status === 'Submitted/Under review' && 'warning') ||
                    (item.status === 'Accepted' && 'primary') ||
                    (item.status === 'Rejected' && 'error') ||
                    'success'
                  }
                >
                  {item.status}
                </Label>
              )}
              <Box m={1} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {item.eventContent}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
