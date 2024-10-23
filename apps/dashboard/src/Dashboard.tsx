import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TODO } from '@the-libs/base-shared';
import { handleSubscribeClick } from '@the-libs/base-frontend';
import axios from 'axios';
import pj from '../../../package.json';

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
    <Grid container direction="column">
      <Grid>
        <Button
          onClick={() => {
            handleSubscribeClick(
              'BEVTZDBLq4rn0uWqN3N3-DxpAJUuwjEtwcKggfdGcwFFLawai-g2gmuHsgBMdocSywRpoGUboFkau4QCfkhFgOc',
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
      </Grid>
      <Grid>{pj.version}</Grid>
      {devices.map((device) => (
        <Grid>
          <Typography>{device.name}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default App;
