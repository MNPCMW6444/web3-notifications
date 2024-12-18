import React, { useState } from "react";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import AppEth from "@ledgerhq/hw-app-eth";
import { getAddress, Transaction } from "ethers";
import { Buffer } from "buffer";

window.Buffer = Buffer;

const LedgerSigner: React.FC = () => {
  const [signedTx, setSignedTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signTransaction = async () => {
    try {
      setSignedTx(null);
      setError(null);

      // Step 1: Debug and Normalize Address
      const rawAddress = "0x828B154032950C8FfEcF7Cfdf44B7BDE6CfA5B58";
      console.log("Raw Address:", rawAddress);

      const normalizedAddress = rawAddress.trim().replace(/\s/g, "");
      console.log("Normalized Address:", normalizedAddress);

      const recipient = getAddress(normalizedAddress); // Validate Address
      console.log("Validated Recipient Address:", recipient);

      // Step 2: Connect to Ledger
      const transport = await TransportWebUSB.create();
      const eth = new AppEth(transport);

      // Step 3: Transaction Details
      const txDetails = {
        to: recipient,
        value: 0n,
        gasLimit: 50000n,
        gasPrice: 10000000000n,
        nonce: 5,
        chainId: 1,
        data: "0xd0f4238500000000000000000000000053f4ec44c6786c4b15945b4321ac23e9eaab597c...",
      };

      // Step 4: Serialize Transaction
      const unsignedTx = Transaction.from(txDetails).unsignedSerialized;
      console.log("Unsigned Transaction:", unsignedTx);

      // Step 5: Ledger Signing
      const path = "44'/60'/0'/0/0";
      const signature = await eth.signTransaction(path, unsignedTx);

      // Step 6: Combine Signed Transaction
      const signedTx = Transaction.from({
        ...txDetails,
        r: `0x${signature.r}`,
        s: `0x${signature.s}`,
        v: parseInt(signature.v, 16),
      }).serialized;

      console.log("Signed Transaction:", signedTx);
      setSignedTx(signedTx);
    } catch (err) {
      console.error("Error signing transaction:", err);
      setError(err.message || "An error occurred while signing the transaction.");
    }
  };

  return (
    <div>
      <h1>Ledger Transaction Signing</h1>
      <button onClick={signTransaction}>Sign Transaction with Ledger</button>
      {signedTx && <pre>Signed Transaction: {signedTx}</pre>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LedgerSigner;
