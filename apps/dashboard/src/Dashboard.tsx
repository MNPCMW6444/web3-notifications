import { Button, Grid2, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TODO, handleSubscribeClick } from '@the-libs/base-shared';
import axios from 'axios';

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
