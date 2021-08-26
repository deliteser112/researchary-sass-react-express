import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';

import SaveIcon from '@material-ui/icons/Save';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DraftsIcon from '@material-ui/icons/Drafts';

// material
import {
  Container,
  Button,
  StepLabel,
  Step,
  Stepper,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@material-ui/core';

import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@material-ui/core/StepConnector';

// hooks
import useConference from '../hooks/useConference';

// redux
import { getUsers } from '../redux/slices/user';
import { getTeamList } from '../redux/slices/team';
import { getTopics } from '../redux/slices/paper';
import { getConferenceList, getConferenceTopicsByTeam, getUserTopics } from '../redux/slices/conference';
import { useDispatch, useSelector } from '../redux/store';

// components
import Page from '../components/Page';
import {
  DetailForm,
  ResearchAreasForm,
  ConferenceVersions,
  SuccessfulForm
} from '../components/dashboard/dashboard-conferences-create';

const steps = ['Details', 'Research areas', 'Conference versions'];

// ----------------------------------------------------------------------

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 136deg, rgb(0 171 85 / 16%) 0%, #007b55 50%, #00ab55 100%)'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 136deg, rgb(0 171 85 / 16%) 0%, #007b55 50%, #00ab55 100%)'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1
  }
}));

const ColorlibStepIconRoot = styled('div')(({ theme, styleProps }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(styleProps.active && {
    backgroundImage: 'linear-gradient( 136deg, rgb(0 171 85 / 16%) 0%, #007b55 50%, #00ab55 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  }),
  ...(styleProps.completed && {
    backgroundImage: 'linear-gradient( 136deg, rgb(0 171 85 / 16%) 0%, #007b55 50%, #00ab55 100%)'
  })
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <VideoLabelIcon />,
    3: <GroupAddIcon />
  };

  return (
    <ColorlibStepIconRoot styleProps={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node
};

export default function ConferenceCreate() {
  const theme = useTheme();

  const { teamList } = useSelector((state) => state.team);
  const { topics } = useSelector((state) => state.paper);
  const { conferenceList, teamTopics, userTopics } = useSelector((state) => state.conference);

  const { pathname } = useLocation();
  const { confId } = useParams();
  const isEdit = pathname.includes('edit');
  const currentConference = conferenceList.find((conference) => conference.id === Number(confId));

  const dispatch = useDispatch();
  const { createConference, updateConference } = useConference();

  const [activeStep, setActiveStep] = useState(0);
  const [saveDraft, setSaveInDraft] = useState(new Set());

  const [validation, setValidation] = useState({ name: false, zbbreviation: false });
  const [conferenceData, setConferenceData] = useState({});

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getTopics());
    dispatch(getTeamList());
    dispatch(getUserTopics());
    dispatch(getConferenceList());
    dispatch(getConferenceTopicsByTeam());
  }, [dispatch]);

  const isStepSaveDraft = (step) => step === 2;

  const isStepSkipped = (step) => saveDraft.has(step);

  const handleNext = async () => {
    let newSkipped = saveDraft;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setSaveInDraft(newSkipped);

    if (conferenceData.detailForm !== undefined) {
      if (conferenceData.detailForm.name.length > 0 && conferenceData.detailForm.abbreviation.length > 0) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        if (conferenceData.detailForm.abbreviation.length === 0) {
          setValidation({ zbbreviation: true });
        } else if (conferenceData.detailForm.name.length === 0) {
          setValidation({ name: true });
        } else {
          setValidation({ name: false });
        }
        setActiveStep((prevActiveStep) => prevActiveStep);
      }
    }

    if (activeStep === 2) {
      if (!isEdit) {
        await createConference({ conferenceData });
      } else {
        const { id } = currentConference;
        const updateData = { ...conferenceData, id };
        await updateConference({ updateData });
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDetailForm = (detailForm) => {
    setConferenceData({ ...conferenceData, detailForm });
  };

  const handleResearchTopics = (researchTopicsForm) => {
    setConferenceData({ ...conferenceData, researchTopicsForm });
  };

  const handleConferenceVersionForm = (conferenceVersionForm) => {
    setConferenceData({ ...conferenceData, conferenceVersionForm });
  };

  // const handleSaveInDraft = () => {
  //   if (!isStepSaveDraft(activeStep)) {
  //     // You probably want to guard against something like this,
  //     // it should never occur unless someone's actively trying to break something.
  //     throw new Error("You can't skip a step that isn't optional.");
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSaveInDraft((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };
  return (
    <Page title="Adding Conference | Researchary">
      <Container maxWidth="lg">
        <Box sx={{ width: '100%' }}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <SuccessfulForm isEdit={isEdit} />
          ) : (
            <Card sx={{ mt: 3 }}>
              <CardHeader title={ConferenceTitles[activeStep]} />
              <CardContent sx={{ [theme.breakpoints.down('sm')]: { padding: theme.spacing(2, 1) } }}>
                <Divider />
                <Box m={4} />
                {activeStep === 0 && (
                  <DetailForm
                    validation={validation}
                    detailFormProps={handleDetailForm}
                    currentConference={currentConference}
                    isEdit={isEdit}
                  />
                )}
                {activeStep === 1 && (
                  <ResearchAreasForm
                    topicsFormProps={handleResearchTopics}
                    currentConference={currentConference}
                    userTopics={userTopics}
                    teamTopics={teamTopics}
                    topics={topics}
                    teams={teamList}
                    isEdit={isEdit}
                  />
                )}
                {activeStep === 2 && (
                  <ConferenceVersions
                    versionFormProps={handleConferenceVersionForm}
                    currentConference={currentConference}
                    isEdit={isEdit}
                  />
                )}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    startIcon={<ArrowBackIosIcon />}
                  >
                    Previous
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  {isStepSaveDraft(activeStep) && (
                    <Button variant="outlined" size="medium" color="primary" startIcon={<DraftsIcon />} sx={{ mr: 1 }}>
                      drafts
                    </Button>
                  )}

                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleNext}
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleNext}
                      endIcon={<ArrowForwardIosIcon />}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Page>
  );
}

const ConferenceTitles = ['Conference information', 'Research areas', 'Conference versions'];
