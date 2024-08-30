import { Typography } from '@mui/material';
import { AuthContextProvider } from '@the-libs/base-frontend';

const MainMessage = ({ text }: { text: string }) => (
  <Typography>{text}</Typography>
);

const App = () => {
  return (
    <AuthContextProvider MainMessage={MainMessage}>
      <Typography>asdasdas</Typography>
    </AuthContextProvider>
  );
};

export default App;
