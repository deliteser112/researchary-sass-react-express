// material
import { Box } from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';
// ----------------------------------------------------------------------

export default function Logo({ ...other }) {
  const theme = useTheme();
  return (
    <Box
      component="img"
      alt="logo"
      src="/static/brand/logo_full.png"
      sx={{ height: 40, [theme.breakpoints.up('sm')]: { height: 70, width: 'auto' } }}
      {...other}
    />
  );
}
