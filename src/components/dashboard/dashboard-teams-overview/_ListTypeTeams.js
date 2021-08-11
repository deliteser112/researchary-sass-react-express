import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import BusinessIcon from '@material-ui/icons/Business';

import { Box, IconButton, MenuItem, ListItemIcon, ListItemText, Popover, Avatar } from '@material-ui/core';

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
    marginRight: 3
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

ListTypeTeams.propTypes = {
  logoURL: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  categories: PropTypes.array
};

export default function ListTypeTeams({ logoURL, title, date, categories }) {
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
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flex: 1,
              [theme.breakpoints.down('md')]: { display: 'block' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar alt={title} src={logoURL} className={classes.large} />
              <Box sx={{ display: 'block' }}>
                <Typography variant="subtitle1" sx={{ textAlign: 'left', maxWidth: 500, marginLeft: 2 }}>
                  {title}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                marginLeft: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 2,
                [theme.breakpoints.down('md')]: { mt: 3, paddingLeft: '95px' },
                [theme.breakpoints.down('sm')]: { display: 'block' }
              }}
            >
              <Box sx={{ textAlign: 'center', [theme.breakpoints.down('sm')]: { textAlign: 'left' } }}>
                {categories.map((item, index) => (
                  <ChipButton key={index} variant="outlined">
                    {item}
                  </ChipButton>
                ))}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  [theme.breakpoints.down('sm')]: { justifyContent: 'left', mt: 2 }
                }}
              >
                <BusinessIcon sx={{ mr: 1, width: 20, height: 20 }} />
                <Typography variant="caption">{date}</Typography>
              </Box>
            </Box>
          </Box>
          <IconButton size="small" ref={anchorRef} aria-label="detail" onClick={handleOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </CardContent>
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
