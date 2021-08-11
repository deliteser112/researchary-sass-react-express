import PropTypes from 'prop-types';

import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import GetAppIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import AssessmentIcon from '@material-ui/icons/Assessment';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { Divider, Box, IconButton, MenuItem, ListItemIcon, ListItemText, Popover } from '@material-ui/core';

// redux
import { useDispatch } from '../../../redux/store';
import { getFileList, deleteFile } from '../../../redux/slices/paper';

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

FilesCard.propTypes = {
  fileId: PropTypes.number,
  fileSize: PropTypes.string,
  logoURL: PropTypes.string,
  title: PropTypes.string,
  updatedDate: PropTypes.string
};

export default function FilesCard({ fileId, fileSize, logoURL, title, updatedDate }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getFileList());
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteFile = () => {
    setOpen(false);
    dispatch(deleteFile(fileId));
  };

  return (
    <Card className={classes.root} variant="contained">
      <CardContent sx={{ minHeight: 290 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption">{fileSize}</Typography>
          <IconButton size="small" ref={anchorRef} aria-label="detail" onClick={handleOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Box m={3} />
        <Box component="img" src={logoURL} sx={{ width: theme.spacing(10), margin: 'auto' }} />
        <Box m={3} />
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
        <Box m={1} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'lightgrey' }}>
          {updatedDate}
        </Typography>
      </CardContent>
      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ mt: 1 }} />
        <Typography variant="caption" sx={{ py: 1, px: 2.5 }}>
          OPTIONS
        </Typography>
        <MenuItem sx={{ py: 1, px: 2.5 }}>
          <ListItemIcon>
            <GetAppIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'caption' }}>Download</ListItemText>
        </MenuItem>
        <MenuItem sx={{ py: 1, px: 2.5 }}>
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'caption' }}>Share file</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 1, px: 2.5 }}>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'caption' }}>Report</ListItemText>
        </MenuItem>
        <MenuItem sx={{ py: 1, px: 2.5 }} onClick={handleDeleteFile}>
          <ListItemIcon>
            <DeleteOutlineIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'caption' }} onClick={handleDeleteFile}>
            Delete
          </ListItemText>
        </MenuItem>
        <Box sx={{ mb: 1 }} />
      </Popover>
    </Card>
  );
}
