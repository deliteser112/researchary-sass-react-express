import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Divider, Box, Tooltip, Avatar, AvatarGroup } from '@material-ui/core';

// import AvatarGroup from '@material-ui/lab/AvatarGroup';

import MoreMenu from './MoreMenu';

const ChipButton = withStyles((theme) => ({
  root: {
    fontWeight: 100,
    fontSize: 11,
    padding: theme.spacing(0.2, 1),
    borderRadius: 3,
    marginRight: 5,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white'
    }
  }
}))(Button);

Details.propTypes = {
  currentPaper: PropTypes.object,
  propTopics: PropTypes.array,
  statusProps: PropTypes.func
};

export default function Details({ currentPaper, propTopics, statusProps }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authors, setAuthors] = useState([]);
  const [paperId, setPaperId] = useState(0);

  const [currentStatus, setCurrentStatus] = useState('');
  useEffect(() => {
    if (currentPaper !== undefined) {
      const { id, title, description, authors, status } = currentPaper;
      setPaperId(id);
      setTitle(title);
      setCurrentStatus(status);
      const htmlString = description;
      const plainString = htmlString.replace(/<[^>]+>/g, '');
      setDescription(plainString);
      setAuthors([...authors]);
    }
  }, [currentPaper]);

  const handleDeleteUser = (userId) => {
    console.log(userId);
  };

  const handleStatus = (statusId) => {
    statusProps(statusId);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color="textSecondary" gutterBottom>
            Paper details
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            <MoreMenu
              onDelete={() => handleDeleteUser(paperId)}
              paperId={paperId}
              statusProps={handleStatus}
              currentStatus={currentStatus}
            />
          </Typography>
        </Box>
        <Divider />
        <Box m={3} />
        <Typography variant="caption">TITLE</Typography>
        <Typography variant="subtitle1">{title}</Typography>
        <Box m={3} />
        <Typography variant="caption">DESCRIPTION</Typography>
        <Box m={2} />
        <Typography variant="body1">{description}</Typography>
        <Box m={2} />
        <Divider />
        <Box m={2} />
        <Typography variant="caption">RESEARCH AREAS</Typography>
        <Box m={1} />
        {propTopics.map((item, index) => (
          <ChipButton key={index} variant="outlined">
            {item.name}
          </ChipButton>
        ))}
        <Box m={2} />
        <Typography variant="caption">CO-AUTHORS</Typography>
        <Box m={2} />
        <AvatarGroup max={4} sx={{ justifyContent: 'flex-end' }}>
          {authors.map((author, index) => (
            <Tooltip key={index} title={`${author.firstname} ${author.lastname}`} placement="top">
              <Avatar alt={author.firstname} src={author.photoURL} />
            </Tooltip>
          ))}
        </AvatarGroup>
      </CardContent>
    </Card>
  );
}
