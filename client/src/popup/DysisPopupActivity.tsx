import React from 'react';

import {Typography, Avatar, Grid, Box, Slider} from '@mui/material';

import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

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