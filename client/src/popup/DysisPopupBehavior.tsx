import React from 'react';

import {Typography, Avatar, Grid, Divider} from '@mui/material';

import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';

export const DysisPopupBehavior = (): JSX.Element => {

  const styleDysisTagLegendBehaviorLabels = {
    borderRadius: '8px 8px 8px 8px',
    margin: '3px',
    padding: '2px 4px',
    color: 'white',
    backgroundColor: 'rgb(99, 99, 99)'
  }

  const textLegendBehaviorLabels = [
    {
      name: 'toxicity',
      definition: 'A rude, disrespectful, or unreasonable comment that is likely to make people leave a discussion.',
    },
    {
      name: 'severe toxicity',
      definition: 'A very hateful, aggressive, disrespectful comment or otherwise very likely to make a user leave a discussion or give up on sharing their perspective. This attribute is much less sensitive to more mild forms of toxicity, such as comments that include positive uses of curse words.',
    },
    {
      name: 'insult',
      definition: 'Insulting, inflammatory, or negative comment towards a person or a group of people.',
    },
    {
      name: 'identity attack',
      definition: 'Negative or hateful comments targeting someone because of their identity.',
    },
    {
      name: 'threat',
      definition: 'Describes an intention to inflict pain, injury, or violence against an individual or group.',
    }
  ]
  
  return (
    <Grid container item
      spacing={0}
      direction={"column"}
      alignItems={"center"}>
      <Avatar>
        <HandshakeOutlinedIcon/>
      </Avatar>
      <Typography 
        variant="h5" 
        gutterBottom
        component="h5">
        Behavior
      </Typography>

      {/* Behavior definition explained */}

      <Typography 
        variant="body1" 
        gutterBottom
        component="p"
        align="center">
        Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
      </Typography>

      <Grid item xs={12} width="100%" paddingBottom={"5px"} paddingTop={"5px"}>
        <Divider variant="middle" />
      </Grid>

      {/* Behavior labels explained */}


      {textLegendBehaviorLabels.map(label => {
        return (
          <Grid container direction={"row"} alignItems="center" columns={12} marginBottom={1} spacing={0}>
            <Grid item xs={4}>
              <span style={styleDysisTagLegendBehaviorLabels}>{label.name}</span>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                color="#333333">
                "{label.definition}"
              </Typography>
            </Grid>
          </Grid>
        )
      })}

      <Grid item xs={12} width="100%" paddingBottom={"5px"} paddingTop={"5px"}>
        <Divider variant="middle" />
      </Grid>

      {/* Behavior values explained */}

       <Grid item xs={12}>
        <Typography
          align="center"
          margin="5px 0px"
          variant="body1"
          color="black">
          If for instance "toxicity" is "80%" then 8 out of 10 people would argue that a recent comment from this user included parts which are toxic.
        </Typography>
      </Grid>
  
      <Grid container direction={"row"} alignItems="center" columns={12} marginBottom={1} spacing={0}>
        <Grid item xs={4} textAlign="right">
          <span style={{
            borderRadius: '8px 0px 0px 8px',
            margin: '2px',
            padding: '2px 4px',
            color: 'white', 
            backgroundColor: 'green'
          }}>0% to 59%</span>
          <Typography
            paddingTop={"4px"}
            variant="body2"
            color="#333333">
            Unlikely to apply
          </Typography>
        </Grid>
        <Grid item xs={4} textAlign="center">
          <span style={{
            borderRadius: '0px',
            margin: '2px',
            padding: '2px 4px',
            color: 'white', 
            backgroundColor: 'rgb(180, 180, 4)'
          }}>60% to 79%</span>
          <Typography
            paddingTop={"4px"}
            variant="body2"
            color="#333333">
            Uncertain if applies
          </Typography>
        </Grid>
        <Grid item xs={4} textAlign="left">
          <span style={{
            borderRadius: '0px 8px 8px 0px',
            margin: '2px',
            padding: '2px 4px',
            color: 'white', 
            backgroundColor: 'red'
          }}>80% to 100%</span>
          <Typography
            paddingTop={"4px"}
            variant="body2"
            color="#333333">
            Likely to apply
          </Typography>
        </Grid>
      </Grid>

    </Grid>
  )
}