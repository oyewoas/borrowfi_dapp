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

const CollateralSection: React.FC = () => {
  const [amount, setAmount] = useState("");
  const { address: connectedAccount } = useAccount();
  const { cltAllowance, refetchAllVariables } = useStatus();
  const [message, setMessage] = useState<{ text: string; type: "info" | "success" | "error" | "warning" }>({ text: "", type: "info" });

  const [simulateRequest, setSimulateRequest] = useState<unknown>(null);
  const parsedAmount = amount ? parseEther(amount) : undefined;
  const isValidAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0;

  // Write contract
  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract();

  // Wait for confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isTxError, error: txError } =
    useWaitForTransactionReceipt({ hash: txHash });

  // Watch events
  useWatchContractEvent({
    ...contracts.borrowFi,
    eventName: "CollateralAdded",
    onLogs: () => setMessage({ text: "Collateral added on-chain!", type: "success" }),
  });

  useWatchContractEvent({
    ...contracts.borrowFi,
    eventName: "CollateralWithdrawn",
    onLogs: () => setMessage({ text: "Collateral withdrawn on-chain!", type: "success" }),
  });

  // ---- Handlers ----
  const handleSimulateAdd = async () => {
    if (!isValidAmount) {
      setMessage({ text: "Please enter a valid amount greater than 0.", type: "warning" });
      return;
    }
    if (!connectedAccount) {
      setMessage({ text: "Please connect your wallet.", type: "warning" });
      return;
    }

    try {
      setMessage({ text: "Simulating addCollateral...", type: "info" });
      const result = await simulateContract(config, {
        ...contracts.borrowFi,
        functionName: "addCollateral",
        args: [parsedAmount!],
        account: connectedAccount,
      });
      setSimulateRequest(result.request);
      setMessage({ text: "Simulation successful! Ready to submit transaction.", type: "success" });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: `Simulation failed: ${getErrorFormatter(err)}`, type: "error" });
    }
  };

  const handleAdd = async () => {
    if (!simulateRequest) {
      setMessage({ text: "Please simulate first before adding collateral.", type: "warning" });
      return;
    }

    try {
      // Approve token if allowance is insufficient
      if (parsedAmount && parsedAmount > cltAllowance) {
        setMessage({ text: "Approving token spend...", type: "info" });
         writeContract({
          ...contracts.cltToken,
          functionName: "approve",
          args: [contracts.borrowFi.address, parsedAmount],
        });
        setMessage({ text: "Approval successful! Now adding collateral...", type: "info" });
        refetchAllVariables();
      }

      writeContract({
        ...contracts.borrowFi,
        functionName: "addCollateral",
        args: [parsedAmount!],
        account: connectedAccount!,
      });
    } catch (err: unknown) {
      setMessage({ text: getErrorFormatter(err), type: "error" });
    }
  };

  const handleSimulateWithdraw = async () => {
    if (!isValidAmount) {
      setMessage({ text: "Please enter a valid amount greater than 0.", type: "warning" });
      return;
    }
    if (!connectedAccount) {
      setMessage({ text: "Please connect your wallet.", type: "warning" });
      return;
    }

    try {
      setMessage({ text: "Simulating withdrawCollateral...", type: "info" });
      const result = await simulateContract(config, {
        ...contracts.borrowFi,
        functionName: "withdrawCollateral",
        args: [parsedAmount!],
        account: connectedAccount,
      });
      setSimulateRequest(result.request);
      setMessage({ text: "Simulation successful! Ready to submit transaction.", type: "success" });
    } catch (err: unknown) {
      setMessage({ text: `Simulation failed: ${getErrorFormatter(err)}`, type: "error" });
    }
  };

  const handleWithdraw = async () => {
    if (!simulateRequest) {
      setMessage({ text: "Please simulate first before withdrawing collateral.", type: "warning" });
      return;
    }

    try {
      writeContract(simulateRequest);
    } catch (err: unknown) {
      setMessage({ text: getErrorFormatter(err), type: "error" });
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-6 w-full max-w-[500px] mb-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Add Collateral</h2>

      {/* Input */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isWritePending || isConfirming}
      />

      {/* Buttons - responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleSimulateAdd}
          disabled={!isValidAmount || !connectedAccount}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Simulate Add
        </button>

        <button
          onClick={handleAdd}
          disabled={!simulateRequest || isWritePending || isConfirming}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isWritePending ? "Confirming..." : isConfirming ? "Mining..." : "Add"}
        </button>

        <button
          onClick={handleSimulateWithdraw}
          disabled={!isValidAmount || !connectedAccount}
          className="flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Simulate Withdraw
        </button>

        <button
          onClick={handleWithdraw}
          disabled={!simulateRequest || isWritePending || isConfirming}
          className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isWritePending ? "Confirming..." : isConfirming ? "Mining..." : "Withdraw"}
        </button>
      </div>

      {/* Status Messages */}
      {isConfirmed && <Message message="Transaction confirmed successfully!" type="success" />}
      {isConfirming && <Message message="Transaction is being mined..." type="info" />}
      {txHash && !isConfirmed && <Message message={`Tx submitted: ${txHash.slice(0, 10)}...`} type="info" />}
      {isWriteError && <Message message={`Write failed: ${getErrorFormatter(writeError)}`} type="error" />}
      {isTxError && <Message message={`Transaction failed: ${getErrorFormatter(txError)}`} type="error" />}
      {message && <Message message={message.text} type={message.type} />}
    </section>
  );
};

export default CollateralSection;
