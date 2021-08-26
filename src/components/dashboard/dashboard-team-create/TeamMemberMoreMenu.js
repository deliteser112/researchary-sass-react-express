import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';

import DeleteButton from '../../ConfirmDialog';

// ----------------------------------------------------------------------

TeamMemberMoreMenu.propTypes = {
  deleteProps: PropTypes.func,
  name: PropTypes.string,
  deleteId: PropTypes.number
};

export default function TeamMemberMoreMenu({ deleteProps, name, deleteId }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteProps = (id) => {
    deleteProps(id);
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
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
          <DeleteButton deleteTitle={name} deleteProps={handleDeleteProps} deleteId={deleteId} />
        </MenuItem>
      </Menu>
    </>
  );
}
