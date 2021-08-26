/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';

import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import BusinessIcon from '@material-ui/icons/Business';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

import { Link as RouterLink } from 'react-router-dom';

import {
  Divider,
  Box,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Avatar,
  AvatarGroup,
  Tooltip
} from '@material-ui/core';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    margin: 'auto'
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  }
}));

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

CardTypeTeams.propTypes = {
  teamId: PropTypes.number,
  logoURL: PropTypes.string,
  name: PropTypes.string,
  topics: PropTypes.array,
  members: PropTypes.array
};

export default function CardTypeTeams({ teamId, logoURL, name, topics, members }) {
  const { user } = useAuth();
  const classes = useStyles();
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [isJoinable, setJoinable] = useState(false);

  useEffect(() => {
    if (user !== null && members.length > 0) {
      members.map((member) => {
        if (member.id === user.id) {
          setJoinable(true);
        }
      });
    }
  }, [user, members]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card className={classes.root} variant="contained">
      <CardContent sx={{ minHeight: 400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <IconButton ref={anchorRef} aria-label="detail" onClick={handleOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Avatar alt={name} src={logoURL} className={classes.large} />
        <Box m={2} />
        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
          {name}
        </Typography>
        <Box m={1} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <BusinessIcon sx={{ mr: 1, width: 20, height: 20 }} />
          <Typography variant="caption">Edinburgh Niper University</Typography>
        </Box>
        <Box m={3} />
        <Box sx={{ textAlign: 'center' }}>
          {topics.map((item, index) => (
            <ChipButton key={index} variant="outlined">
              {item.name}
            </ChipButton>
          ))}
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing(2, 1) }}
      >
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          <AvatarGroup max={4}>
            {members !== undefined &&
              members.map((member, index) => (
                <Tooltip key={index} title={`${member.firstname} ${member.lastname}`} placement="top">
                  <Avatar key={index} alt={`${member.firstname} ${member.lastname}`} src={member.photoURL} />
                </Tooltip>
              ))}
          </AvatarGroup>
        </Box>
        {!isJoinable && (
          <Box sx={{ display: 'block', textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              startIcon={<GroupAddIcon />}
            >
              Request to join
            </Button>
          </Box>
        )}
      </Box>
      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.teams.root}/${teamId}/edit`}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'caption' }}>Edit Team</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'caption' }}>View Team</ListItemText>
        </MenuItem>
      </Popover>
    </Card>
  );
}
