import React from 'react';
import './App.css';
import { Tab } from 'semantic-ui-react';

// Tabs
import Ability from "./Tabs/Ability";
import Achievement from "./Tabs/Achievement";
import Job from "./Tabs/Job";
import Project from "./Tabs/Project";



function App() {
  return (
    <div className="App">
      <h1>Admin panel for portfolio</h1>
      <Tab panes={
        [
          { menuItem: 'Ability', render: () => <Ability/> },
          { menuItem: 'Achievement', render: () => <Achievement/> },
          { menuItem: 'Job', render: () => <Job/> },
          { menuItem: 'Project', render: () => <Project/> }
        ]
      }
        renderActiveOnly={true}
      />
    </div>
  );
}

export default App;
