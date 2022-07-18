import React from 'react';

import {Typography, Avatar, Grid, Box, Slider} from '@mui/material';

import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';

export const DysisPopupBehavior = (): JSX.Element => {

  const marks = [
    {
      value: 0,
      label: '0°C',
    },
    {
      value: 20,
      label: '20°C',
    },
    {
      value: 37,
      label: '37°C',
    },
    {
      value: 100,
      label: '100°C',
    },
  ];
  
  function valuetext(value: number) {
    return `${value}°C`;
  }

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
      <Typography 
        variant="body1" 
        gutterBottom
        component="p"
        align="center">
        Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
      </Typography>
      <Box sx={{ width: 300 }}>
        <Slider
          aria-label="Custom marks"
          defaultValue={[0, 10]}
          step={1}
          min={0}
          max={10}
          valueLabelDisplay="auto"
          marks={[
            {
              value: 0,
              label: "0 out of 10 people"
            },
            { value: 1
            },
            { value: 2
            },
            { value: 3
            },
            { value: 4
            },
            { value: 5
            },
            { value: 6
            },
            { value: 7
            },
            { value: 8
            },
            { value: 9
            },
            { value: 10,
              label: "10 out of 10 people"
            }
          ]}
          disabled
        />
      </Box>
      <Grid container item
        direction="row"
        columns={25}
        textAlign="center">
        <Grid item xs={5}>
          <Typography 
            variant="h6" 
            gutterBottom
            component="h6">
            Toxicity
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom
            component="p">
            A rude, disrespectful, or unreasonable comment that is likely to make people leave a discussion.
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography 
            variant="h6" 
            gutterBottom
            component="h6">
            Severe Toxicity
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom
            component="p">
            A very hateful, aggressive, disrespectful comment or otherwise very likely to make a user leave a discussion or give up on sharing their perspective. This attribute is much less sensitive to more mild forms of toxicity, such as comments that include positive uses of curse words.
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography 
            variant="h6" 
            gutterBottom
            component="h6">
            Insult
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom
            component="p">
            Insulting, inflammatory, or negative comment towards a person or a group of people.
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography 
            variant="h6" 
            gutterBottom
            component="h6">
            Identity Attack
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom
            component="p">
            Negative or hateful comments targeting someone because of their identity.
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography 
            variant="h6" 
            gutterBottom
            component="h6">
            Threat
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom
            component="p">
            Describes an intention to inflict pain, injury, or violence against an individual or group.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}