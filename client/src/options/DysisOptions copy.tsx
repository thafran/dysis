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
    return (
      participant.agreedToTerms 
      && participant.firstName !== '' 
      && participant.lastName !== ''
      && !participant.submitted);
  }

  const handleSubmit = async ()  => {
    const response = await DysisRequest.post(
      'tracking/create',
      {
        'participantFirstName': participant.firstName.trim(),
        'participantLastName': participant.lastName.trim(),
        'participantAgreedToTerms': participant.agreedToTerms,
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
        dysisParticipantAgreedToTerms: participant.agreedToTerms,
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
          variant="body1">
        Hi there, and welcome to the Reddit Insights Browser Extension
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
            In order to continually improve the extension we are collecting limited usage data in accordance with the Google Chrome Web Store Developer Agreement. 
          </Typography>
        <FormGroup>
          <Typography
            marginTop={2}
            variant="caption"
            display="block"
            gutterBottom 
            color='lightgray'>
            If you want to withdraw from the study please contact your study coordinator.
          </Typography>
        </FormGroup>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="DYSIS STUDY"
        aria-describedby="Successfully enrolled"
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
            DYSIS STUDY
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Successfully enrolled in study
          </Typography>
        </Box>
      </Modal>
    </React.Fragment>
  )
}
