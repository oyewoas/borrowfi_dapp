import { createContext, useContext } from "react";

export type StatusContextType = {
  collateral: bigint;
  loan: bigint;
  totalCollateral: bigint;
  totalBorrowed: bigint;
  userCLT: bigint;
  userLTC: bigint;
  userBFI: bigint;
  availableBorrow: bigint;
  availableCLT: bigint;
  cltAllowance: bigint;
  loading: boolean;
    refetchAllVariables: () => Promise<void>;
};

export const StatusContext = createContext<StatusContextType | undefined>(
  undefined
);

export const useStatus = (): StatusContextType => {
  const ctx = useContext(StatusContext);
  if (!ctx) throw new Error("useStatus must be used inside StatusProvider");
  return ctx;
};
