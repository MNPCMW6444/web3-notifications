import { Button, Grid2, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { TODO, handleSubscribeClick } from '@the-libs/base-shared';
import pj from '../../../package.json';
import { ServerContext } from '@the-libs/base-frontend';

const App = () => {
  const server = useContext(ServerContext);
  const [devices, setDevices] = useState<TODO[]>([]);

  const fetchDevices = async () => {
    try {
      const res = await server?.axiosInstance?.get('/api/' + 'devices');
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
                  ?.post(+'/api/' + 'registerDevice', {
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
      {devices.map((device) => (
        <Grid2>
          <Typography>{device.name}</Typography>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default App;
