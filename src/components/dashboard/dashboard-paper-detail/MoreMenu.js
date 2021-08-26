/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

MoreMenu.propTypes = {
  statusProps: PropTypes.func,
  onDelete: PropTypes.func,
  paperId: PropTypes.number,
  currentStatus: PropTypes.string
};

export default function MoreMenu({ onDelete, paperId, currentStatus, statusProps }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    if (currentStatus.length > 0) {
      possibleStatus.map((pStatus) => {
        if (pStatus[currentStatus] !== undefined) {
          setStatuses([...pStatus[currentStatus]]);
        }
      });
    }
  }, [currentStatus]);

  const handleClickStatus = (statusId) => {
    statusProps(statusId);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.papers.root}/${paperId}/edit`}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit paper" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {statuses.map((status, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClickStatus(status.id);
            }}
          >
            <ListItemIcon>
              <HelpOutlineIcon sx={{ width: 15, height: 15 }} />
            </ListItemIcon>
            <ListItemText primary={status.value} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        ))}
        <MenuItem onClick={onDelete}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}

const possibleStatus = [
  { 'Not started': [{ id: 1, value: "Mark as 'In progress'" }] },
  {
    'In progress': [
      { id: 2, value: "Mark as 'Blocked/On Hold'" },
      { id: 3, value: "Mark as 'Ready to submit'" }
    ]
  },
  { 'Blocked/On Hold': [] },
  { 'Ready to submit': [{ id: 4, value: "Mark as 'Submitted/Under review'" }] },
  {
    'Submitted/Under review': [
      { id: 5, value: "Mark as 'Rejected'" },
      { id: 6, value: "Mark as 'Accepted'" }
    ]
  },
  { Rejected: [{ id: 1, value: "Mark as 'In progress'" }] },
  { Accepted: [{ id: 7, value: "Mark as 'Published'" }] },
  { Published: [] }
];
