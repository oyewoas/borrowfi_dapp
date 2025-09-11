import React, { type ReactNode } from "react";
import { useAccount, useReadContract } from "wagmi";
import contracts from "../contracts";
import { zeroAddress, formatEther } from "viem";
import { StatusContext, type StatusContextType } from "./StatusContext";

export const StatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address: connectedAccount } = useAccount();

  // Core reads
  const { data: collateral, refetch: refetchUserCollateral } = useReadContract({
    ...contracts.borrowFi,
    functionName: "collateralOf",
    args: [connectedAccount ?? zeroAddress],
  });
  const { data: loan, refetch: refetchUserLoan } = useReadContract({
    ...contracts.borrowFi,
    functionName: "loanOf",
    args: [connectedAccount ?? zeroAddress],
  });
  const { data: totalCollateral, refetch: refetchTotalCollateral } = useReadContract({
    ...contracts.borrowFi,
    functionName: "totalCollateral",
  });
  const { data: totalBorrowed, refetch: refetchTotalBorrowed } = useReadContract({
    ...contracts.borrowFi,
    functionName: "totalBorrowed",
  });

  // Extra reads
  const { data: userCLT, refetch: refetchUserCLT } = useReadContract({
    ...contracts.cltToken,
    functionName: "balanceOf",
    args: [connectedAccount ?? zeroAddress],
  });
  const { data: userBFI, refetch: refetchUserBFI } = useReadContract({
    ...contracts.borrowToken,
    functionName: "balanceOf",
    args: [connectedAccount ?? zeroAddress],
  });
  const { data: availableBorrow, refetch: refetchAvailableBorrow } = useReadContract({
    ...contracts.borrowToken,
    functionName: "balanceOf",
    args: [contracts.borrowFi.address],
  });
  const { data: availableCLT, refetch: refetchAvailableCLT } = useReadContract({
    ...contracts.cltToken,
    functionName: "balanceOf",
    args: [contracts.borrowFi.address],
  });
  const { data: cltAllowance, refetch: refetchCltAllowance } = useReadContract({
    ...contracts.cltToken,
    functionName: "allowance",
    
    args: [connectedAccount ?? zeroAddress, contracts.borrowFi.address],
  });
const {data: userLTC, refetch: refetchUserLTC} = useReadContract({
    ...contracts.borrowFi,
    functionName: "getLTC",
  });
   const refetchAllVariables = async () => {
      await Promise.all([
          refetchAvailableCLT(),
          refetchUserCLT(),
          refetchCltAllowance(),
          refetchUserBFI(),
          refetchTotalBorrowed(),
          refetchTotalCollateral(),
          refetchAvailableBorrow(),
          refetchUserLTC(),
          refetchUserLoan(),
          refetchUserCollateral()
      ])
    }
  const loading =
    collateral === undefined ||
    loan === undefined ||
    totalCollateral === undefined ||
    totalBorrowed === undefined;
  const value: StatusContextType = {
    collateral: formatEther(BigInt(collateral ?? 0)),
    loan: formatEther(BigInt(loan ?? 0)),
    totalCollateral: formatEther(BigInt(totalCollateral ?? 0)),
    totalBorrowed: formatEther(BigInt(totalBorrowed ?? 0)),
    userCLT: formatEther(BigInt(userCLT ?? 0)),
    userBFI: formatEther(BigInt(userBFI ?? 0)),
    availableBorrow: formatEther(BigInt(availableBorrow ?? 0)),
    availableCLT: formatEther(BigInt(availableCLT ?? 0)),
    cltAllowance: formatEther(BigInt(cltAllowance ?? 0)),
    userLTC: formatEther(BigInt(userLTC ?? 0)),
    refetchAllVariables,
    loading,
  };

  return <StatusContext.Provider value={value}>{children}</StatusContext.Provider>;
};
