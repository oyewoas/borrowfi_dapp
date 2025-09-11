import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import contracts from "../contracts";
import { parseEther } from "viem";
import Message from "./Message";
import { getErrorFormatter } from "../utils/getErrorFormatter";
import { useStatus } from "../providers/StatusContext";

interface ApproveCLTProps {
  amount?: string; // optional, defaults to max approval
}

const ApproveCLT: React.FC<ApproveCLTProps> = ({ amount }) => {
  const { address: connectedAccount } = useAccount();
    const { refetchAllVariables } = useStatus();
  const [inputAmount, setInputAmount] = useState(amount || "");
  const [message, setMessage] = useState<{ text: string; type: "info" | "success" | "error" | "warning" }>({
    text: "",
    type: "info",
  });

  const parsedAmount = inputAmount ? parseEther(inputAmount) : undefined;
  const isValidAmount = inputAmount && !isNaN(Number(inputAmount)) && Number(inputAmount) > 0;

  const { writeContract, data: txHash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isTxError, error: txError } =
    useWaitForTransactionReceipt({ hash: txHash });

  React.useEffect(() => {
    if (isConfirmed) {
      refetchAllVariables();
    }
  }, [isConfirmed, refetchAllVariables]);

  const handleApprove = () => {
    if (!connectedAccount) {
      setMessage({ text: "Please connect your wallet.", type: "warning" });
      return;
    }
    if (!isValidAmount) {
      setMessage({ text: "Please enter a valid amount to approve.", type: "warning" });
      return;
    }

    try {
      setMessage({ text: "Submitting approval...", type: "info" });
      writeContract({
        ...contracts.cltToken,
        functionName: "approve",
        args: [contracts.borrowFi.address, parsedAmount!],

        
      }, {
        onSuccess: () => {
          setMessage((prev) => ({ ...prev, text: "" }));
          setInputAmount("");
        }
      });
      setMessage((prev) => ({
        ...prev,
        text: "",
      }));
      refetchAllVariables();
    } catch (err: unknown) {
      setMessage({ text: getErrorFormatter(err), type: "error" });
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-6 w-full max-w-[500px] mb-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
        Approve CLT
      </h2>

      <input
        type="number"
        placeholder="Amount to approve"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isPending || isConfirming}
      />

      <button
        onClick={handleApprove}
        disabled={!isValidAmount || !connectedAccount || isPending || isConfirming}
        className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
      >
        {isPending ? "Submitting..." : isConfirming ? "Mining..." : "Approve"}
      </button>

      {/* Status messages */}
      {isConfirmed && <Message message="Approval confirmed!" type="success" />}
      {isPending && <Message message="Transaction submitted, waiting for confirmation..." type="info" />}
      {isError && <Message message={`Approval failed: ${getErrorFormatter(error)}`} type="error" />}
      {isTxError && <Message message={`Transaction error: ${getErrorFormatter(txError)}`} type="error" />}
      {message.text && <Message message={message.text} type={message.type} />}
    </section>
  );
};

export default ApproveCLT;
