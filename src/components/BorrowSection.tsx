import React, { useState } from "react";
import { useWriteContract } from "wagmi";
import contracts from "../contracts";
import { parseEther } from "viem";

const BorrowSection: React.FC = () => {
  const [amount, setAmount] = useState("");
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBorrow = async () => {
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
        functionName: "borrow",
        args: [parsedAmount],
      });
      if (txHash) {
        setMessage("Borrowed successfully!");
      } else {
        setMessage("Error borrowing");
      }
    } catch (e) {
      setMessage("Error borrowing");
    }
    setLoading(false);
  };
  return (
    <section className="bg-white rounded-xl shadow-md p-6 min-w-[300px] max-w-[350px] flex-1 mb-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Borrow</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleBorrow}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 mb-2"
      >
        Borrow
      </button>
      {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
    </section>
  );
};

export default BorrowSection;
