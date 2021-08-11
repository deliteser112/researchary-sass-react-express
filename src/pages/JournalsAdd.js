import * as React from 'react';
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
// components
import Page from '../components/Page';
import {
  DetailForm,
  ResearchAreasForm,
  JournalIssueForm,
  SuccessfulForm
} from '../components/dashboard/dashboard-journals-add';

const steps = ['Details', 'Research areas', 'Journal Issues'];

// ----------------------------------------------------------------------

export default function ConferenceAdd() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [saveDraft, setSaveInDraft] = React.useState(new Set());

  const isStepSaveDraft = (step) => step === 2;

  const isStepSkipped = (step) => saveDraft.has(step);

  const handleNext = () => {
    let newSkipped = saveDraft;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSaveInDraft(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <SuccessfulForm />
          ) : (
            <Card sx={{ mt: 3 }}>
              <CardHeader title={PaperTitles[activeStep]} />
              <CardContent>
                <Divider />
                <Box m={4} />
                {activeStep === 0 && <DetailForm />}
                {activeStep === 1 && <ResearchAreasForm />}
                {activeStep === 2 && <JournalIssueForm />}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                    Previous Step
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  {isStepSaveDraft(activeStep) && (
                    <Button variant="outlined" size="medium" color="primary" sx={{ mr: 1 }}>
                      Save in drafts
                    </Button>
                  )}

                  <Button variant="contained" size="small" color="primary" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Save Jouranl' : 'Next'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Page>
  );
}

const PaperTitles = ['Journal information', 'Research areas', 'Journal issues'];
