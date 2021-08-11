import PropTypes from 'prop-types';

import React, { useState, useRef } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import {
  Divider,
  Box,
  Rating,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Avatar
} from '@material-ui/core';

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
    width: theme.spacing(10),
    height: theme.spacing(10),
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

CardTypeConference.propTypes = {
  rate: PropTypes.number,
  logoURL: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  categories: PropTypes.array,
  toSubmit: PropTypes.number,
  underReview: PropTypes.number,
  published: PropTypes.number
};

export default function CardTypeConference({
  rate,
  logoURL,
  title,
  date,
  categories,
  toSubmit,
  underReview,
  published
}) {
  const classes = useStyles();
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card className={classes.root} variant="contained">
      <CardContent sx={{ minHeight: 350 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Rating name="read-only" size="small" max={3} value={rate} readOnly />
          <IconButton size="small" ref={anchorRef} aria-label="detail" onClick={handleOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Box m={3} />
        <Avatar alt={title} src={logoURL} className={classes.large} />
        <Box m={3} />
        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
        <Box m={3} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CalendarTodayIcon sx={{ mr: 1, width: 15, height: 15 }} />
          <Typography variant="caption">{date}</Typography>
        </Box>
        <Box m={3} />
        <Box sx={{ textAlign: 'center' }}>
          {categories.map((item, index) => (
            <ChipButton key={index} variant="outlined">
              {item}
            </ChipButton>
          ))}
        </Box>
      </CardContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: theme.spacing(2, 5) }}>
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          <Typography variant="body1" color="secondary">
            {toSubmit}
          </Typography>
          <Typography variant="caption">To submit</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          <Typography variant="body1" color="secondary">
            {underReview}
          </Typography>
          <Typography variant="caption">Under review</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          <Typography variant="body1" color="secondary">
            {published}
          </Typography>
          <Typography variant="caption">Published</Typography>
        </Box>
      </Box>
      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ py: 1, px: 2.5 }}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'caption' }}>View Conference</ListItemText>
        </MenuItem>
      </Popover>
    </Card>
  );
}
