/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import VisibilityIcon from '@material-ui/icons/Visibility';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';

// components
import DeleteButton from '../../ConfirmDialog';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
// ----------------------------------------------------------------------

PaperMoreMenu.propTypes = {
  authors: PropTypes.array,
  paperId: PropTypes.number,
  paperName: PropTypes.string,
  onDelete: PropTypes.func
};

export default function PaperMoreMenu({ authors, onDelete, paperId, paperName }) {
  const { user } = useAuth();

  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (user !== null && authors.length > 0) {
      authors.map((author) => {
        if (author.id === user.id) {
          setIsEditable(true);
        }
      });
    }
  }, [user, authors]);

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
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.papers.root}/${paperId}/detail`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText primary="View Paper" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {isEditable && (
          <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.papers.root}/${paperId}/edit`}>
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: 'caption' }}>Edit Paper</ListItemText>
          </MenuItem>
        )}
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
          <DeleteButton deleteTitle={paperName} deleteProps={onDelete} deleteId={paperId} />
        </MenuItem>
      </Menu>
    </>
  );
}
