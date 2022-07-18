import React, { useEffect, useState } from 'react'

import {
  Typography,
  TextField,
  Button,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Container,
  Grid
} from '@mui/material'

import './DysisOptions.css'

import {DysisRequest} from '../DysisRequest';

export const DysisOptions = (): JSX.Element => {

  const [participant, setParticipant] = useState({
    firstName: '',
    lastName: '',
    id: null,
    agreedToTerms: false,
    submitted: false,
    installationDate: '',
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
        'participantFirstName': participant.firstName,
        'participantLastName': participant.lastName,
        'participantAgreedToTerms': participant.agreedToTerms,
        'participantSubmitted': true,
        'participantInstallationDate': participant.installationDate,
      }
    )
    setParticipant({ ...participant, submitted: true});
    if (response) {
      chrome.storage.local.set({
        dysisParticipantFirstName: participant.firstName,
        dysisParticipantLastName: participant.lastName,
        dysisParticipantID: response.data.participantID,
        dysisParticipantAgreedToTerms: participant.agreedToTerms,
        dysisParticipantSubmitted: true,
      });
    }
  }
  
  const toggleButton = () => {
    setParticipant({ ...participant, agreedToTerms: (participant.agreedToTerms ? false : true)})
  }

  return (
    <React.Fragment>
      <Container 
        maxWidth="lg">
      <Typography 
        variant="h1" 
        component="h1">
        Dysis
      </Typography>
      <Typography
        variant="h2"
        component="h2">
        Study Participation
      </Typography>
      <FormGroup>
        <TextField
          id="form-participant-input-fist-name"
          label="Participant first name"
          variant="standard"
          value={participant.firstName}
          required={true} 
          disabled={participant.submitted}
          onChange={handleChange} 
          name="firstName"/>
        <TextField
          id="form-participant-input-last-name"
          label="Participant last name"
          variant="standard"
          value={participant.lastName}
          required={true} 
          disabled={participant.submitted}
          onChange={handleChange}
          name="lastName"/>
        <TextField id="form-participant-input-last-name"
          label="Extension installation date"
          variant="standard"
          value={new Date(participant.installationDate).toLocaleString()}
          disabled={true}
          onChange={handleChange}
          name="installationDate"/>
        <FormControlLabel 
          label ="Agree to study terms"
          control={
            <Checkbox 
            checked={participant.agreedToTerms}
            disabled={participant.submitted}
            onChange={toggleButton}/>
          }></FormControlLabel>
        <Grid 
          justifyContent="flex-end">
          <Button
            id="form-participant-button"
            onClick={handleSubmit}
            disabled={!canSubmit()}>{participant.submitted ? "Submitted" : "Submit"}</Button>
        </Grid>
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
    </React.Fragment>
  )
}
