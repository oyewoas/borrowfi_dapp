import { createContext, useContext } from "react";

export type StatusContextType = {
  collateral: string;
  loan: string;
  totalCollateral: string;
  totalBorrowed: string;
  userCLT: string;
  userLTC: string;
  userBFI: string;
  availableBorrow: string;
  availableCLT: string;
  cltAllowance: string;
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
