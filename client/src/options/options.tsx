import React from 'react'
import { createRoot } from 'react-dom/client'

import { DysisOptions } from './DysisOptions';

const App = (): JSX.Element => {

  return (
    <React.Fragment>
      <DysisOptions />
    </React.Fragment>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)
