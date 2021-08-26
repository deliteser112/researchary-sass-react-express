import PropTypes from 'prop-types';

import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Button, Typography, Container } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// components
import { MotionContainer, varBounceIn } from '../../animate';
import { UploadIllustration } from '../../../assets';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(5)
}));

// ----------------------------------------------------------------------

SuccessfulForm.propTypes = {
  isEdit: PropTypes.bool
};

export default function SuccessfulForm({ isEdit }) {
  return (
    <RootStyle>
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Successful!
              </Typography>
            </motion.div>
            {!isEdit ? (
              <Typography sx={{ color: 'text.secondary' }}>The paper has been successfully saved</Typography>
            ) : (
              <Typography sx={{ color: 'text.secondary' }}>The Paper has been successfully updated.</Typography>
            )}

            <motion.div variants={varBounceIn}>
              <UploadIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </motion.div>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                component={RouterLink}
                variant="outlined"
                color="primary"
                size="medium"
                startIcon={<ArrowBackIosIcon />}
                sx={{ mr: 2 }}
                to={PATH_DASHBOARD.papers.overview}
              >
                Back to papers
              </Button>
              <Button
                size="medium"
                variant="contained"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Add new Paper
              </Button>
            </Box>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
