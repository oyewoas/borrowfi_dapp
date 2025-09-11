import React, { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { simulateContract } from "@wagmi/core";
import { parseEther } from "viem";
import { config } from "../config";
import contracts from "../contracts";
import { useStatus } from "../providers/StatusContext";
import Message from "./Message";
import { getErrorFormatter } from "../utils/getErrorFormatter";

const AddCollateralSection: React.FC = () => {
  const [amount, setAmount] = useState("");
  const { address: connectedAccount } = useAccount();
  const { cltAllowance } = useStatus();
  const [message, setMessage] = useState<{ text: string; type: "info" | "success" | "error" | "warning" }>({ text: "", type: "info" });

  const parsedAmount = amount ? parseEther(amount) : BigInt(0);
  const isValidAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0;

  const { writeContract, data: txHash, isPending: isWritePending, isError: isWriteError, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isTxError, error: txError } = useWaitForTransactionReceipt({ hash: txHash });

  // Watch add collateral event
  useWatchContractEvent({
    ...contracts.borrowFi,
    eventName: "CollateralAdded",
    onLogs: () => setMessage({ text: "Collateral added on-chain!", type: "success" }),
  });

  // ---- Handlers ----
  const handleSimulateAdd = async () => {
    if (!isValidAmount) {
      setMessage({ text: "Enter a valid amount greater than 0.", type: "warning" });
      return;
    }
    if (!connectedAccount) {
      setMessage({ text: "Connect your wallet first.", type: "warning" });
      return;
    }

    // Check allowance
    if (parsedAmount && parsedAmount > parseEther(cltAllowance)) {
      setMessage({ text: "Approve CLT tokens first.", type: "warning" });
      return;
    }

    try {
      setMessage({ text: "Simulating addCollateral...", type: "info" });
      await simulateContract(config, {
        ...contracts.borrowFi,
        functionName: "addCollateral",
        args: [parsedAmount],
        account: connectedAccount,
      });
      setMessage({ text: "Simulation successful! Ready to submit transaction.", type: "success" });
    } catch (err: unknown) {
      setMessage({ text: `Simulation failed: ${getErrorFormatter(err)}`, type: "error" });
    }
  };

  const handleAdd = async () => {

    try {
      // Approve CLT if needed
      if (parsedAmount && parsedAmount > parseEther(cltAllowance)) {
        setMessage({ text: "Approving CLT spend...", type: "info" });
         writeContract({
          ...contracts.cltToken,
          functionName: "approve",
          args: [contracts.borrowFi.address, parsedAmount],
        }, {
          onSuccess: () => {
                    setMessage({ text: "Approval successful! Now adding collateral...", type: "info" });
          },
        });
      }

      writeContract({
        ...contracts.borrowFi,
        functionName: "addCollateral",
        args: [parsedAmount],
        account: connectedAccount,
      }, {
        onSettled: () => {
          setMessage({ text: "", type: "info" });
          },
      });
    } catch (err: unknown) {
      setMessage({ text: getErrorFormatter(err), type: "error" });
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-6 w-full max-w-[500px] mb-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Add Collateral</h2>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isWritePending || isConfirming}
      />

      <div className="flex-col flex sm:flex-row gap-3 mb-4">
        <button
          onClick={handleSimulateAdd}
          disabled={!isValidAmount || !connectedAccount}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-orange-400 flex-1"
        >
         Simulate
        </button>

        <button
          onClick={handleAdd}
          disabled={!isValidAmount || isWritePending || isConfirming}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400 flex-1"
        >
          
          {isWritePending ? "Confirming..." : isConfirming ? "Mining..." : "Add"}
        </button>
      </div>

      {isConfirmed && <Message message="Transaction confirmed!" type="success" />}
      {isConfirming && <Message message="Transaction is being mined..." type="info" />}
      {txHash && !isConfirmed && <Message message={`Tx submitted: ${txHash.slice(0, 10)}...`} type="info" />}
      {isWriteError && <Message message={`Write failed: ${getErrorFormatter(writeError)}`} type="error" />}
      {isTxError && <Message message={`Transaction failed: ${getErrorFormatter(txError)}`} type="error" />}
      {message && <Message message={message.text} type={message.type} />}
    </section>
  );
};

export default AddCollateralSection;
