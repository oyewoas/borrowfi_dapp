import React, { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { simulateContract } from "@wagmi/core";
import { parseEther } from "viem";
import { config } from "../config"; // wagmi config
import contracts from "../contracts";
import Message from "./Message";
import { getErrorFormatter } from "../utils/getErrorFormatter";

const BorrowSection: React.FC = () => {
  const [amount, setAmount] = useState("");
  const { address: connectedAccount } = useAccount();
  const [message, setMessage] = useState<{
    text: string;
    type: "info" | "success" | "error" | "warning";
  }>({
    text: "",
    type: "info",
  });

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
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Watch Borrow events
  useWatchContractEvent({
    ...contracts.borrowFi,
    eventName: "Borrowed",
    onLogs: () => {
      setMessage({
        text: "Borrow successful! Event detected on-chain.",
        type: "success",
      });
    },
  });

  // ---- Handlers ----
  const handleSimulate = async () => {
    if (!isValidAmount) {
      setMessage({
        text: "Please enter a valid amount greater than 0.",
        type: "warning",
      });
      return;
    }
    if (!connectedAccount) {
      setMessage({
        text: "Please connect your wallet.",
        type: "warning",
      });
      return;
    }

    try {
      setMessage({
        text: "Running simulation...",
        type: "info",
      });
      await simulateContract(config, {
        ...contracts.borrowFi,
        functionName: "borrow",
        args: [parsedAmount!],
        account: connectedAccount,
      });

      setMessage({
        text: "Simulation successful! Transaction looks valid.",
        type: "success",
      });
    } catch (err: unknown) {
      setMessage({
        text: `Simulation failed: ${getErrorFormatter(err)}`,
        type: "error",
      });
    }
  };

  const handleBorrow = async () => {


    try {
      setMessage({
        text: "Submitting transaction...",
        type: "info",
      });
      writeContract({
        ...contracts.borrowFi,
        functionName: "borrow",
        args: [parsedAmount!],
      });
    } catch (err) {
      console.error("Error submitting tx:", err);
      setMessage({
        text: "Failed to submit transaction.",
        type: "error",
      });
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-6 min-w-[350px] max-w-[500px] w-full mb-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Borrow</h2>

      {/* Input */}
      <input
        type="number"
        placeholder="Amount to borrow"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isWritePending || isConfirming}
      />

      {/* Buttons */}
      <div className="flex-col flex sm:flex-row gap-3 mb-4">
        <button
          onClick={handleSimulate}
          disabled={!isValidAmount || !connectedAccount}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-orange-400 flex-1"
        >
         Simulate
        </button>
        <button
          onClick={handleBorrow}
          disabled={!isValidAmount || isWritePending || isConfirming}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400 flex-1"
        >
          {isWritePending ? "Confirming..." : isConfirming ? "Mining..." : "Borrow"}
        </button>
      </div>

      {/* Status Messages */}
      {isConfirmed && (
        <Message message="Transaction confirmed successfully!" type="success" />
      )}
      {isConfirming && (
        <Message message="Transaction is being mined..." type="info" />
      )}
      {txHash && !isConfirmed && (
        <Message message={`Tx submitted: ${txHash.slice(0, 10)}...`} type="info" />
      )}

      {/* Errors */}
      {isWriteError && (
        <Message
          message={`Write failed: ${
            getErrorFormatter(writeError)
          }`}
          type="error"
        />
      )}
      {isTxError && (
        <Message
          message={`Transaction failed: ${getErrorFormatter(txError)}`}
          type="error"
        />
      )}

      {/* General message */}
      {message && <Message message={message.text} type={message.type} />}
    </section>
  );
};

export default BorrowSection;
