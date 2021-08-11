import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import { useRef, useState } from 'react';
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
  title: PropTypes.string
};

export default function MoreMenu({ onDelete, title, statusProps }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

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
        <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.papers.root}/${paramCase(title)}/edit`}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit paper" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {statuses.map((status, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClickStatus(index);
            }}
          >
            <ListItemIcon>
              <HelpOutlineIcon sx={{ width: 15, height: 15 }} />
            </ListItemIcon>
            <ListItemText primary={status} primaryTypographyProps={{ variant: 'body2' }} />
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

const statuses = [
  "Mark as 'Not started'",
  "Mark as 'In progress'",
  "Mark as 'Blocked/On Hold'",
  "Mark as 'Ready to submit'",
  "Mark as 'Under review'",
  "Mark as 'Accepted'",
  "Mark as 'Completed'"
];
