import { Button, Grid2, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { TODO } from '@the-libs/base-shared';
import { handleSubscribeClick, ServerContext } from '@the-libs/base-frontend';
import pj from '../../../package.json';

const App = () => {
  const server = useContext(ServerContext);
  const [devices, setDevices] = useState<TODO[]>([]);

  const fetchDevices = async () => {
    try {
      const res = await server?.axiosInstance?.get('api/devices');
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
                server?.axiosInstance
                  ?.post('/api/registerDevice', {
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
      <Grid2>{pj.version}</Grid2>
      {devices.map((device, i) => (
        <Grid2 key={i}>
          <Typography>{device.name}</Typography>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default App;
