import React, { useState } from "react";
import { useWriteContract } from "wagmi";
import contracts from "../contracts";
import { parseEther } from "viem";

const CollateralSection: React.FC = () => {
  const [amount, setAmount] = useState("");
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAdd = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage("Please enter a valid amount greater than 0.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const parsedAmount = parseEther(amount);
      const txHash = await writeContractAsync({
        ...contracts.borrowFi,
        functionName: "addCollateral",
        args: [parsedAmount],
      });
      if (txHash) {
        setMessage("Collateral added!");
      } else {
        setMessage("Error adding collateral");
      }
    } catch (e) {
      setMessage("Error adding collateral");
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage("Please enter a valid amount greater than 0.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const parsedAmount = parseEther(amount);
      const txHash = await writeContractAsync({
        ...contracts.borrowFi,
        functionName: "withdrawCollateral",
        args: [parsedAmount],
      });
      if (txHash) {
        setMessage("Collateral withdrawn!");
      } else {
        setMessage("Error withdrawing collateral");
      }
    } catch (e) {
      setMessage("Error withdrawing collateral");
    }
    setLoading(false);
  };
  return (
    <section className="bg-white rounded-xl shadow-md p-6 min-w-[300px] max-w-[350px] flex-1 mb-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Collateral</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
        >
          Add
        </button>
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md disabled:opacity-50"
        >
          Withdraw
        </button>
      </div>
      {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
    </section>
  );
};

export default CollateralSection;
