import React from 'react';

export const DysisTag = (props: {
  type: 'behavior' | 'interests' | 'metrics',
  label: string,
  value: number,
  unit: string,
}): JSX.Element => {

  const LOWER_RANGE_OF_YELLOW: number = 60;
  const LOWER_RANGE_OF_RED: number = 80;

  const styleDysisTag = {
    'borderRadius': '6px',
    'margin': '3px',
  }

  const styleDysisTagLeft = {
    'padding': '1px 4px',
    'borderRadius': '8px 0px 0px 8px',
    'fontSize': '9px',
  }

  const styleDysisTagRight = {
    'padding': '1px 4px',
    'borderRadius': '0px 8px 8px 0px',
    'fontSize': '9px',
  }

  let backgroundColorLeft: string;
  let backgroundColorRight: string;
  let colorLeft: string;
  let colorRight: string;

  switch(props.type) {
    case 'behavior':
      backgroundColorLeft = 'rgb(99, 99, 99)';
      colorLeft = 'white';
      if (props.value >= LOWER_RANGE_OF_RED) {
        backgroundColorRight = 'red';
      } else if (props.value >= LOWER_RANGE_OF_YELLOW) {
        backgroundColorRight = 'rgb(180, 180, 4)'
      } else {
        backgroundColorRight = 'green'
      }
      colorRight = 'white'
      break;
    case 'interests':
      backgroundColorLeft = 'lightblue';
      colorLeft = 'black';
      backgroundColorRight = 'darkblue';
      colorRight = 'white'
      break;
    case 'metrics': 
      backgroundColorLeft = 'rgb(209 185 251)';
      colorLeft = 'black';
      backgroundColorRight = 'rgb(106 43 216)';
      colorRight = 'white';
      break;
  }

  return (
    <React.Fragment>
      <span style={styleDysisTag}>
        <span style={
          {
            ...styleDysisTagLeft,
            backgroundColor: backgroundColorLeft,
            color: colorLeft,
          }
        }>{props.label}</span>
        <span style={
          {
            ...styleDysisTagRight,
            backgroundColor: backgroundColorRight,
            color: colorRight,
          }
        }>{props.value}{props.unit ? props.unit : ''}</span>
      </span>
    </React.Fragment>
  )
}