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
import Message from "./Message";
import { getErrorFormatter } from "../utils/getErrorFormatter";

const WithdrawCollateralSection: React.FC = () => {
  const [amount, setAmount] = useState("");
  const { address: connectedAccount } = useAccount();
  const [message, setMessage] = useState<{ text: string; type: "info" | "success" | "error" | "warning" }>({ text: "", type: "info" });

  const parsedAmount = amount ? parseEther(amount) : BigInt(0);
  const isValidAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0;

  const { writeContract, data: txHash, isPending: isWritePending, isError: isWriteError, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isTxError, error: txError } = useWaitForTransactionReceipt({ hash: txHash });

  // Watch withdraw collateral event
  useWatchContractEvent({
    ...contracts.borrowFi,
    eventName: "CollateralWithdrawn",
    onLogs: () => setMessage({ text: "Collateral withdrawn on-chain!", type: "success" }),
  });

  const handleSimulateWithdraw = async () => {
    if (!isValidAmount) {
      setMessage({ text: "Enter a valid amount greater than 0.", type: "warning" });
      return;
    }
    if (!connectedAccount) {
      setMessage({ text: "Connect your wallet first.", type: "warning" });
      return;
    }

    try {
      setMessage({ text: "Simulating withdrawCollateral...", type: "info" });
      await simulateContract(config, {
        ...contracts.borrowFi,
        functionName: "withdrawCollateral",
        args: [parsedAmount],
        account: connectedAccount,
      });
      setMessage({ text: "Simulation successful! Ready to submit transaction.", type: "success" });
    } catch (err: unknown) {
      setMessage({ text: `Simulation failed: ${getErrorFormatter(err)}`, type: "error" });
    }
  };

  const handleWithdraw = async () => {

    try {
      // Submit the simulated withdraw transaction
      writeContract({
        ...contracts.borrowFi,
        functionName: "withdrawCollateral",
        args: [parsedAmount!],
        account: connectedAccount!,
      }, {
        onSuccess: () => {
          setMessage({ text: "", type: "info" });
          setAmount("");
        }
      });
    } catch (err: unknown) {
      setMessage({ text: getErrorFormatter(err), type: "error" });
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-6 w-full max-w-[500px] mb-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Withdraw Collateral</h2>

      {/* Input */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isWritePending || isConfirming}
      />

      {/* Buttons */}
     <div className="flex-col flex sm:flex-row gap-3 mb-4">
        <button
          onClick={handleSimulateWithdraw}
          disabled={!isValidAmount || !connectedAccount}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-orange-400 flex-1"
        >
         Simulate
        </button>

        <button
          onClick={handleWithdraw}
          disabled={!isValidAmount || isWritePending || isConfirming}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400 flex-1"
        >

          {isWritePending ? "Confirming..." : isConfirming ? "Mining..." : "Withdraw"}
        </button>
      </div>

      {/* Status messages */}
      {isConfirmed && <Message message="Transaction confirmed!" type="success" />}
      {isConfirming && <Message message="Transaction is being mined..." type="info" />}
      {txHash && !isConfirmed && <Message message={`Tx submitted: ${txHash.slice(0, 10)}...`} type="info" />}
      {isWriteError && <Message message={`Write failed: ${getErrorFormatter(writeError)}`} type="error" />}
      {isTxError && <Message message={`Transaction failed: ${getErrorFormatter(txError)}`} type="error" />}
      {message && <Message message={message.text} type={message.type} />}
    </section>
  );
};

export default WithdrawCollateralSection;
