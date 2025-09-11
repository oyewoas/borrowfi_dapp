import React from "react";
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  WalletIcon,
  BuildingLibraryIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ScaleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useStatus } from "../providers/StatusContext";

// 🔹 Popover for long values
const PopoverValue: React.FC<{ value?: string }> = ({ value }) => {
  if (!value) return null;
  const formatted = value.toString();
  const truncated =
    formatted.length > 10 ? `${formatted.slice(0, 10)}...` : formatted;

  return (
    <span className="relative group cursor-pointer">
      <span className="text-gray-900 font-semibold text-sm sm:text-base truncate max-w-[120px] inline-block transition-colors duration-200 group-hover:text-blue-600">
        {truncated}
      </span>
      <span className="absolute left-1/2 top-full z-10 -translate-x-1/2 mt-2 px-3 py-1 bg-white border border-blue-300 rounded-xl shadow-lg text-xs sm:text-sm text-blue-700 font-mono whitespace-nowrap transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none">
        {formatted}
      </span>
    </span>
  );
};

// 🔹 Card Item
const StatusItem: React.FC<{
  label: string;
  value?: string;
  icon: React.ReactNode;
  bg: string;
}> = ({ label, value, icon, bg }) => (
  <div
    className={`${bg} rounded-lg p-3 flex justify-between items-center transition hover:shadow-md`}
  >
    <div className="flex items-center gap-2">
      <span className="text-gray-600 w-5 h-5">{icon}</span>
      <span className="font-medium text-gray-700 text-sm sm:text-base">
        {label}
      </span>
    </div>
    <PopoverValue value={value} />
  </div>
);

const StatusSection: React.FC = () => {
  // Read contract data
  const {
    collateral,
    loan,
    userCLT,
    userBFI,
    availableBorrow,
    availableCLT,
    totalBorrowed,
    cltAllowance,
    totalCollateral,
    userLTC,
    loading,
  } = useStatus();

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full flex-1 mb-6 transition-transform hover:scale-[1.01] hover:shadow-xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-700">
        Status
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User balances */}
        <StatusItem
          label="Your Collateral"
          value={collateral?.toString()}
          icon={<CurrencyDollarIcon />}
          bg="bg-blue-50"
        />
        <StatusItem
          label="Your Loan"
          value={loan?.toString()}
          icon={<BanknotesIcon />}
          bg="bg-green-50"
        />
        <StatusItem
          label="Your CLT Balance"
          value={userCLT?.toString()}
          icon={<WalletIcon />}
          bg="bg-purple-50"
        />
        <StatusItem
          label="Your LTC Balance"
          value={userLTC?.toString()}
          icon={<ScaleIcon />}
          bg="bg-gray-50"
        />

        <StatusItem
          label="Your BFI Balance"
          value={userBFI?.toString()}
          icon={<BuildingLibraryIcon />}
          bg="bg-yellow-50"
        />

        {/* Pool balances */}
        <StatusItem
          label="Available Borrow"
          value={availableBorrow?.toString()}
          icon={<ArrowDownCircleIcon />}
          bg="bg-gray-50"
        />
        <StatusItem
          label="Available CLT"
          value={availableCLT?.toString()}
          icon={<ArrowUpCircleIcon />}
          bg="bg-gray-50"
        />
       
        {/* Totals */}
        <StatusItem
          label="Total Borrowed"
          value={totalBorrowed?.toString()}
          icon={<BanknotesIcon />}
          bg="bg-red-50"
        />

        {/* Allowance */}
        <StatusItem
          label="CLT Allowance"
          value={cltAllowance?.toString()}
          icon={<LockClosedIcon />}
          bg="bg-orange-50"
        />
        <StatusItem
          label="Total Collateral"
          value={totalCollateral?.toString()}
          icon={<ScaleIcon />}
          bg="bg-red-50 lg:col-span-3"
        />
      </div>

      {loading && (
        <div className="mt-4 text-blue-500 animate-pulse">Loading...</div>
      )}
    </section>
  );
};

export default StatusSection;
