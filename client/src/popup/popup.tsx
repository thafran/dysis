import React from 'react';
import {createRoot} from 'react-dom/client';

import {DysisPopup} from './DysisPopup';

const App: React.FC<{}> = () => {
  return (
    <div style={{width: '400px', height: '400px', padding: '10px 0px'}}>
      <DysisPopup></DysisPopup>
    </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)
