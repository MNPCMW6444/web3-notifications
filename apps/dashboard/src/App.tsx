import { Typography } from '@mui/material';
import React from 'react';
import { getFrontendSettings, ServerProvider } from '@the-libs/base-frontend';
import Dashboard from './Dashboard';
import PreSign from './PreSign';

const MainMessage = ({ text }: { text: string }) => (
  <Typography>{text}</Typography>
);

const App = () => {

  return (
     <ServerProvider exactDomainURI="http://127.0.0.1:3450" MainMessage={MainMessage} frontendSettings={()=>getFrontendSettings([], false,import.meta.env as any)} domain="">
    <Dashboard />
       <PreSign/>
     </ServerProvider>
  );
};

export default App;
