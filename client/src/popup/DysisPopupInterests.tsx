import React from 'react';

import {Typography, Avatar, Grid, Box, Slider} from '@mui/material';

import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';

export const DysisPopupInterests = (): JSX.Element => {

  return (
    <Grid container item
      spacing={0}
      direction={"column"}
      alignItems={"center"}>
      <Avatar>
        <InterestsOutlinedIcon/>
      </Avatar>
      <Typography 
        variant="h5" 
        gutterBottom
        component="h5">
        Interests
      </Typography>
      <Typography 
        variant="body1" 
        gutterBottom
        component="p"
        align="center">
        Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
      </Typography>    
    </Grid>
  )
}