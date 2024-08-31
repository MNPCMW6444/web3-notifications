import { Button, Grid2, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TODO, handleSubscribeClick } from '@the-libs/base-shared';
import axios from 'axios';
import { frontendSettings } from '@the-libs/base-frontend';

const d =
  // frontendSettings().VITE_NODE_ENV === 'development'
  //  ? 'http://localhost:3450'
  // :
  'https://server.w3notif.com';

const App = () => {
  // const server = useContext(ServerContext);
  const [devices, setDevices] = useState<TODO[]>([]);

  const fetchDevices = async () => {
    try {
      //const res = await server?.axiosInstance?.get('devices');
      const res = await axios.get(d + '/api/' + 'devices');
      setDevices(res?.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchDevices().then();
  }, []);

  return (
    <Grid2 container direction="column">
      <Grid2>
        <Button
          onClick={() => {
            handleSubscribeClick(
              'BPYxL1BdQA3nmQT0Qtv4cD4p3lPIR2UIF0FdfDll1hvac6nQJ84dHiHjoZM10zZAWVvp2juEpfpr5F9yQEV3zvM',
              (pushSubscription) => {
                /*  const res = await server?.axiosInstance?.post('/registerDevice', {
                subscription: pushSubscription,
              });*/
                axios
                  .post(d + '/api/' + 'registerDevice', {
                    subscription: pushSubscription,
                  })
                  .then(() => fetchDevices().then());
              },
            );
          }}
        >
          Add this device
        </Button>
      </Grid2>
      {devices.map((device) => (
        <Grid2>
          <Typography>{device.name}</Typography>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default App;
