import { Button, Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ServerContext } from '@the-libs/base-frontend';
import { TODO } from '@the-libs/base-shared';

const App = () => {
  const server = useContext(ServerContext);
  const [devices, setDevices] = useState<TODO[]>([]);

  const fetchDevices = async () => {
    try {
      const res = await server?.axiosInstance?.get('devices');
      setDevices(res?.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchDevices().then();
  }, []);

  return (
    <Grid container direction="column">
      <Grid item>
        <Button>Add this device</Button>
      </Grid>
      {devices.map((device) => (
        <Grid item>
          <Button>{device.name}</Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default App;
