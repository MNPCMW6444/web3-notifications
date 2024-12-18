import { FC, useState } from 'react';
import TrezorConnect from '@trezor/connect-web';
import { ethers } from 'ethers';


TrezorConnect.manifest({
  email: 'michael@w3notif.com',
  appUrl: 'http://w3notif.com'
})


const TrezorSigner: FC = () => {
  const [signedTx, setSignedTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signTransaction = async () => {
    try {
      // Reset state
      setSignedTx(null);
      setError(null);


      // Transaction details
      const tx = {
        to: '0x0000000000000000000000000000000000000000', // Example recipient
        value: '0x0de0b6b3a7640000', // 1 ETH in hexadecimal (1 * 10^18)
        gasLimit: '0x5208', // 21000 gas (basic transaction)
        gasPrice: '0x3b9aca00', // 1 Gwei in hexadecimal (1 * 10^9)
        nonce: '0x0', // Replace with the actual nonce
        chainId: 1, // Mainnet
      };

      // Ask Trezor to sign the transaction
      const response = await TrezorConnect.ethereumSignTransaction({
        path: "m/44'/60'/0'/0/0", // Default Ethereum derivation path
        transaction: tx,
      });

      if (response.success) {
        const { r, s, v } = response.payload;

        // Combine the transaction signature into a raw transaction (RLP encoded)
        const rawTx = {
          ...tx,
          r: `0x${r}`,
          s: `0x${s}`,
          v: parseInt(v, 16),
        };

        // Serialize the signed transaction
        const serializedTx = ethers.Transaction.from(rawTx).serialized;
        setSignedTx(serializedTx);

        console.log('Signed Transaction:', serializedTx);
        alert('Transaction signed successfully!');
      } else {
        setError(response.payload.error || 'Unknown error during signing');
        console.error('Signing error:', response.payload.error);
      }
    } catch (err:any) {
      setError(err.message || 'Error signing transaction');
      console.error('Error signing transaction:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Trezor Transaction Signing</h1>
      <button
        onClick={signTransaction}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Sign Transaction with Trezor
      </button>

      {signedTx && (
        <div style={{ marginTop: '20px' }}>
          <h3>Signed Transaction:</h3>
          <textarea
            value={signedTx}
            readOnly
            rows={5}
            style={{ width: '100%', padding: '10px', fontFamily: 'monospace' }}
          />
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TrezorSigner;
