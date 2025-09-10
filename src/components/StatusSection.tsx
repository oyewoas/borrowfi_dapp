import React from "react";

import { useAccount, useReadContract } from "wagmi";
import contracts from "../contracts";
import { formatEther, zeroAddress } from "viem";
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
// PopoverValue component for displaying full value on click
const PopoverValue: React.FC<{ value?: string }> = ({ value }) => {
  if (!value) return null;
  const truncated = value.length > 8 ? `${value.slice(0, 8)}...` : value;
  return (
    <span className="relative group cursor-pointer">
      <span className="text-gray-900 font-semibold text-lg truncate max-w-[120px] inline-block transition-colors duration-200 group-hover:text-blue-600">
        {truncated}
      </span>
      <span className="absolute left-1/2 top-full z-10 -translate-x-1/2 mt-2 px-4 py-2 bg-white border border-blue-300 rounded-xl shadow-lg text-sm text-blue-700 font-mono whitespace-nowrap transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none">
        {value}
      </span>
    </span>
  );
};
const StatusSection: React.FC = () => {
  const { address: connectedAccount } = useAccount();
  const { data: collateral } = useReadContract({
    ...contracts.borrowFi,
    functionName: "collateralOf",
    args: [connectedAccount ?? zeroAddress],
  });
  const { data: loan } = useReadContract({
    ...contracts.borrowFi,
    functionName: "loanOf",
    args: [connectedAccount ?? zeroAddress],
  });
  const { data: totalCollateral } = useReadContract({
    ...contracts.borrowFi,
    functionName: "totalCollateral",
  });
  const { data: totalBorrowed } = useReadContract({
    ...contracts.borrowFi,
    functionName: "totalBorrowed",
  });
  const loading =
    collateral === undefined ||
    loan === undefined ||
    totalCollateral === undefined ||
    totalBorrowed === undefined;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 min-w-[300px] max-w-3xl w-full flex-1 mb-4 transition-transform hover:scale-[1.02] hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        <ChartBarIcon className="w-6 h-6 text-blue-500" /> Status
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <BanknotesIcon className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-gray-700">Your Collateral</span>
          </div>
          <span className="text-gray-900 font-semibold text-lg">
            {formatEther(BigInt(collateral ?? 0))}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
            <span className="font-medium text-gray-700">Your Loan</span>
          </div>
          <span className="text-gray-900 font-semibold text-lg">
            {formatEther(BigInt(loan ?? 0))}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between bg-purple-50 rounded-lg p-3 group cursor-pointer">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <UserIcon className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-gray-700">Total Collateral</span>
          </div>
          <span className="relative">
            <span className="text-gray-900 font-semibold text-lg truncate max-w-[120px] inline-block transition-colors duration-200 group-hover:text-blue-600">
              {formatEther(BigInt(totalCollateral ?? 0)).length > 8
                ? `${formatEther(BigInt(totalCollateral ?? 0)).slice(0, 8)}...`
                : formatEther(BigInt(totalCollateral ?? 0))}
            </span>
            <span className="absolute left-1/2 top-full z-10 -translate-x-1/2 mt-2 px-4 py-2 bg-white border border-blue-300 rounded-xl shadow-lg text-sm text-blue-700 font-mono whitespace-nowrap transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none">
              {formatEther(BigInt(totalCollateral ?? 0))}
            </span>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between bg-red-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <CurrencyDollarIcon className="w-5 h-5 text-red-400" />
            <span className="font-medium text-gray-700">Total Borrowed</span>
          </div>
          <PopoverValue value={formatEther(BigInt(totalBorrowed ?? 0))} />
        </div>
      </div>
      {loading && (
        <div className="mt-4 text-blue-500 animate-pulse">Loading...</div>
      )}
    </section>
  );
};

export default StatusSection;
