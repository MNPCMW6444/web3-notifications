import { Typography } from '@mui/material';
import React from 'react';
import { ServerProvider } from '@the-libs/base-frontend';
import Dashboard from './Dashboard';

const MainMessage = ({ text }: { text: string }) => (
  <Typography>{text}</Typography>
);

const App = () => {
  return (
    // <ServerProvider domain="server.w3notif.com" MainMessage={MainMessage}>
    <Dashboard />
    // </ServerProvider>
  );
};

export default App;
