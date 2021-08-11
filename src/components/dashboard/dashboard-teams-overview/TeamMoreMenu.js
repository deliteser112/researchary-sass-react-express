import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

TeamMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  teamId: PropTypes.number
};

export default function TeamMoreMenu({ onDelete, teamId }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

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
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
          <ListItemText primaryTypographyProps={{ variant: 'caption' }} onClick={onDelete}>
            View Team
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
