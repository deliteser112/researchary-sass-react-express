import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { TextField, Alert, Typography, Box, Grid, FormHelperText, Rating } from '@material-ui/core';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { MIconButton } from '../../@material-extend';

// component
import { QuillEditor } from '../../editor';

import { UploadAvatar } from '../../upload';
import { fData } from '../../../utils/formatNumber';
// ----------------------------------------------------------------------

export default function DetailForm() {
  const { register } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [value, setValue] = React.useState(1);

  const DetailSchema = Yup.object().shape({
    conferencename: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Paper title required'),
    avatarUrl: Yup.mixed().required('Avatar is required')
  });

  const formik = useFormik({
    initialValues: {
      conferencename: '',
      avatarUrl: null
    },
    validationSchema: DetailSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await register(values.avatarUrl, values.conferencename, values.description, values.topics, values.privacy);
        enqueueSnackbar('Register success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, touched, values, handleSubmit, getFieldProps, setFieldValue } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
        <Box sx={{ mb: 5 }}>
          <UploadAvatar
            accept="image/*"
            file={values.avatarUrl}
            maxSize={3145728}
            onDrop={handleDrop}
            error={Boolean(touched.avatarUrl && errors.avatarUrl)}
            caption={
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif
                <br /> max size of {fData(3145728)}
              </Typography>
            }
          />
          <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
            {touched.avatarUrl && errors.avatarUrl}
          </FormHelperText>
        </Box>

        <Grid container spacing={3.5} dir="ltr">
          <Grid item xs={12}>
            <TextField
              placeholder="Enter Journal name here"
              fullWidth
              label="Journal name"
              {...getFieldProps('journalName')}
              error={Boolean(touched.journalName && errors.journalName)}
              helperText={touched.journalName && errors.journalName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Name abbreviation e.g. ICSE"
              fullWidth
              label="Journal name abbreviation "
              {...getFieldProps('journalAbbreviation')}
              error={Boolean(touched.journalAbbreviation && errors.journalAbbreviation)}
              helperText={touched.journalAbbreviation && errors.journalAbbreviation}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">About the journal(Optional)</Typography>
            <QuillEditor
              id="post-content"
              error={Boolean(touched.content && errors.content)}
              placeholder="Type some information about joural..."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Journal Publisher"
              fullWidth
              label="Publisher"
              {...getFieldProps('journalPublisher')}
              error={Boolean(touched.journalPublisher && errors.journalPublisher)}
              helperText={touched.journalPublisher && errors.journalPublisher}
            />
          </Grid>
          <Grid item xs={12}>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">Journal Score</Typography>
              <Rating
                size="large"
                max={3}
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
