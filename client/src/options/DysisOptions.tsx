import React, { useEffect, useState } from 'react'

import {
  Typography,
  TextField,
  Button,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Container,
  Grid,
  Box,
  Modal,
  Link,
} from '@mui/material'

import {DysisRequest} from '../DysisRequest';

export const DysisOptions = (): JSX.Element => {

  const [participant, setParticipant] = useState({
    firstName: '',
    lastName: '',
    id: null,
    agreedToTerms: false,
    submitted: false,
    installationDate: 'string',
  });

  useEffect(() => {
    chrome.storage.local.get([
      'dysisParticipantFirstName',
      'dysisParticipantLastName',
      'dysisParticipantID',
      'dysisParticipantAgreedToTerms',
      'dysisParticipantSubmitted',
      'dysisInstallationDate',
    ], (res) => {
      setParticipant({
        firstName: res.dysisParticipantFirstName,
        lastName: res.dysisParticipantLastName,
        id: res.dysisParticipantID,
        agreedToTerms: res.dysisParticipantAgreedToTerms,
        submitted: res.dysisParticipantSubmitted,
        installationDate: res.dysisInstallationDate,
      })
  })}, []);
  

  const handleChange = (event: any) => {
    setParticipant({ ...participant, [event.target.name]: event.target.value });
  };

  const canSubmit = () => {
    return (true
      //participant.agreedToTerms 
      //&& participant.firstName !== '' 
      //&& participant.lastName !== ''
      //&& !participant.submitted
      );
  }

  const handleSubmit = async ()  => {
    const response = await DysisRequest.post(
      'tracking/create',
      {
        'participantFirstName': participant.firstName.trim(),
        'participantLastName': participant.lastName.trim(),
        'participantAgreedToTerms': true,
        'participantSubmitted': true,
        'participantInstallationDate': participant.installationDate,
      }
    )
    setParticipant({ ...participant, submitted: true});
    if (response) {
      chrome.storage.local.set({
        dysisParticipantFirstName: participant.firstName.trim(),
        dysisParticipantLastName: participant.lastName.trim(),
        dysisParticipantID: response.data.participantID,
        dysisParticipantAgreedToTerms: true,
        dysisParticipantSubmitted: true,
      });
    }
    handleOpen();
  }

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true)
  }
  
  const handleClose = () => {
    setOpen(false);
  }
  
  const toggleButton = () => {
    setParticipant({ ...participant, agreedToTerms: (participant.agreedToTerms ? false : true)})
  }

  const createNewTab = (link: string): void => {
    chrome.tabs.create({url: link})
  }

  return (
    <React.Fragment>
      <Container 
        maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h3">
        Reddit Insights
        </Typography>
        <Typography
          marginTop={2}
          variant="h6">
        Features
        </Typography>
        <Typography
            variant="body1"
            display="block"
            gutterBottom>
            Reddit Insights was developed to help you contextualize and better understand the contributions of other Reddit users. In order to do this, Reddit Insights shows you the five subreddits other users are most active in, based on their last 300 posts. 
          </Typography>
          <Typography
          marginTop={2}
          variant="h6">
        Data Protection
        </Typography>
        <Typography
            variant="body1"
            display="block"
            gutterBottom>
            In order to continually improve the extension we are collecting limited usage data including your username and when you are using the extension. By clicking the button below you give us permission to use the aforementioned data in anonymized form for scientific research in order to better understand the underlying concepts of signalling theory online and further improve Reddit Insights.
            </Typography>
            <Typography
            marginBottom={2}
            variant="body1"
            display="block"
            gutterBottom>
            An overworked PhD candidate from Munich would massively appreciate your help! :-)
            </Typography>
          <Grid 
            justifyContent="flex-end">
            <Button variant="contained"
              id="form-participant-button"
              onClick={handleSubmit}
              disabled={!canSubmit()}>{participant.submitted ? "" : "I Agree"}</Button>
          </Grid>
          <Typography
            marginTop={2}
            variant="caption"
            display="block"
            gutterBottom >
            If you have any questions or ideas for improvement, please email me (Franz) at waltenberger@cdtm.de. Thanks! 
          </Typography>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Reddit Insights"
        aria-describedby="You are all set!"
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '1px solid grey',
          borderRadius: '5px',
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          You are all set!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            You can now close this tab and start browsing Reddit
          </Typography>
        </Box>
      </Modal>
    </React.Fragment>
  )
}