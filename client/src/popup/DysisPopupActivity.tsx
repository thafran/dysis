import React from 'react';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import { Typography, Avatar, Grid } from '@mui/material';

import { dysisConfig } from '../DysisConfig';

export const DysisPopupActivity = (): JSX.Element => {

  return (
    <Grid container item 
      spacing={0}
      direction={"column"}
      alignItems={"center"}>
      <Avatar>
        <InsertChartOutlinedIcon/>
      </Avatar>
      <Typography 
        variant="h5" 
        gutterBottom
        component="h5">
        Activity
      </Typography>
      <Grid item xs={12} marginBottom={1}>
        <span
          style={{
            borderRadius: '8px 8px 8px 8px',
            margin: '5px',
            padding: '2px 4px',
          }}>
          <span
            style={{
              borderRadius: '8px 0px 0px 8px',
              padding: '2px 4px',
              color: 'black',
              backgroundColor: 'rgb(209 185 251)'
            }}>
            metric (activity)
          </span>
          <span
            style={{
              borderRadius: '0px 8px 8px 0px',
              padding: '2px 4px',
              color: 'white',
              backgroundColor: 'rgb(106 43 216)'
            }}>
            value
          </span>
        </span>
      </Grid>
      <Typography 
        variant="body1" 
        gutterBottom
        component="p"
        align="center">
        { `Different metrics are generated based on up to ${ dysisConfig.reddit.activity.maxFetchedPosts } latest posts of a user.` }
      </Typography>      
    </Grid>
  )
}