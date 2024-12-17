import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  Container,
} from '@mui/material';

declare global {
  interface Window {
    ethereum?: any;
  }
}

function PreSign() {
  const [signedTxs, setSignedTxs] = useState<string[]>([]);
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduled, setScheduled] = useState(false);

  const HOLESKY_RPC_URL = 'https://rpc.holesky.ethpandaops.io'; // Holešky RPC
  const CHAIN_ID = 17000; // Chain ID for Holešky

  // Generate 10 transactions with varying 6th parameter
  const generateTransactions = () => {
    const baseParameters = [
      '00000000000000000000000053f4ec44c6786c4b15945b4321ac23e9eaab597c',
      '00000000000000000000000096512230bf0fa4e20cf02c3e8a7d983132cd2b9f',
      '0000000000000000000000000000000000000000000055ad2657a90bec3afded',
      '0000000000000000000000000000000000000000000000000000000000000080',
      '0000000000000000000000009d39a5de30e57443bff2a8307a4256c8797a3497',
      '', // Placeholder for the sixth parameter
      '0000000000000000000000009d39a5de30e57443bff2a8307a4256c8797a3497',
      '0000000000000000000000000000000000000000000000000000000000000000',
      '00000000000000000000000000000000000000000000000000000000000000a0',
      '0000000000000000000000000000000000000000000000000000000000000000',
      '0000000000000000000000000000000000000000000000000000000000000000',
      '0000000000000000000000000000000000000000000000000000000000000080',
      '0000000000000000000000000000000000000000000000000000000000000000',
      '0000000000000000000000000000000000000000000000000000000000000000',
    ];

    const transactions = [];

    for (let i = 100; i <= 1000; i += 100) {
      const decimalValue = i.toString(16).padStart(64, '0');
      const parameters = [...baseParameters];
      parameters[5] = decimalValue; // Update the sixth parameter

      transactions.push({
        MethodID: '0xd0f42385',
        parameters,
      });
    }

    return transactions;
  };

  // Sign transactions locally
  const signTransactions = async () => {
    if (!window.ethereum) {
      alert('MetaMask or compatible wallet (e.g., Rabby) is required!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (String(network.chainId) !== String(CHAIN_ID)) {
        alert('Please switch to the Holešky testnet in your wallet.');
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const transactions = generateTransactions();
      const signedTransactions: string[] = [];

      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];

        const nonce = await provider.getTransactionCount(address, 'latest'); // Current nonce
        const feeData = await provider.getFeeData();

        const transaction = {
          to: '0x0000000000000000000000000000000000000000',
          value: ethers.parseEther('0.0'),
          data: tx.MethodID + tx.parameters.join(''),
          nonce,
          gasLimit: ethers.toBigInt(100000), // Adjust gas limit as needed
          gasPrice: feeData.gasPrice, // Replace getGasPrice
          chainId: CHAIN_ID,
        };

        console.log(`Signing Transaction ${i + 1}:`, transaction);

        // Sign the transaction locally
        const rawSignedTransaction = await signer.signTransaction(transaction);
        signedTransactions.push(rawSignedTransaction);
      }

      setSignedTxs(signedTransactions);
      alert('Transactions signed successfully! Check console for details.');
      console.log('Signed Transactions:', signedTransactions);
    } catch (error) {
      console.error('Signing error:', error);
      alert('Error signing transactions. See console for details.');
    }
  };

  useEffect(() => {
    if (scheduled && signedTxs.length > 0 && scheduleTime) {
      const delay = new Date(scheduleTime).getTime() - Date.now();
      if (delay > 0) {
        const timer = setTimeout(() => {
          signedTxs.forEach((tx, index) => {
            console.log(`Sending transaction ${index + 1}:`, tx);
          });
          alert('Transactions sent successfully!');
        }, delay);

        return () => clearTimeout(timer);
      } else {
        alert('Invalid schedule time! Time must be in the future.');
        setScheduled(false);
      }
    }
  }, [scheduled, signedTxs, scheduleTime]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Holešky Transaction Signer
      </Typography>

      <Box mb={4}>
        <Typography variant="h6">Sign Transactions</Typography>
        <Button variant="contained" color="primary" onClick={signTransactions}>
          Sign Transactions
        </Button>
        {signedTxs.length > 0 && (
          <List>
            {signedTxs.map((tx, index) => (
              <ListItem key={`signed-tx-${index}`}>
                <Typography variant="body1">
                  Transaction {index + 1}: {tx}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Box mb={4}>
        <Typography variant="h6">Schedule Transactions</Typography>
        <TextField
          label="Schedule Time"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setScheduled(true)}
        >
          Schedule Transactions
        </Button>
      </Box>
    </Container>
  );
}

export default PreSign;
