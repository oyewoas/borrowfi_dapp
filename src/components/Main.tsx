import {useAccount, useReadContract, useWriteContract} from "wagmi";
import contracts from "../contracts";
import {formatEther, parseEther, zeroAddress} from "viem";
import {useState} from "react";

const Main = () => {
    const [cltInput, setCltInput] = useState("");
    const {address: connectedAccount} = useAccount();
    const { writeContractAsync } = useWriteContract()

  const { data: totalBorrowed } = useReadContract({
    ...contracts.borrowFi,
    functionName: "totalBorrowed",
  });
  const { data: totalCollateral } = useReadContract({
    ...contracts.borrowFi,
    functionName: "totalCollateral",
  });
  const {data: userCollateral} = useReadContract({
    ...contracts.borrowFi,
    functionName: "collateralOf",
    args: [connectedAccount ?? zeroAddress]
  });

  const {data: userLoan} = useReadContract({
    ...contracts.borrowFi,
    functionName: "loanOf",
    args: [connectedAccount ?? zeroAddress]
  });  const {data: userLTC} = useReadContract({
    ...contracts.borrowFi,
    functionName: "getLTC",
  });

  const {data: userCLT} = useReadContract({
    ...contracts.cltToken,
    functionName: "balanceOf",
    args: [connectedAccount ?? zeroAddress]
  });

  const {data: userBFI} = useReadContract({
    ...contracts.borrowToken,
    functionName: "balanceOf",
    args: [connectedAccount ?? zeroAddress]
  });

  const {data: availableBorrow} = useReadContract({
    ...contracts.borrowToken,
    functionName: "balanceOf",
    args: [contracts.borrowFi.address]
  });
  const {data: availableCLT} = useReadContract({
    ...contracts.cltToken,
    functionName: "balanceOf",
    args: [contracts.borrowFi.address]
  });

  const {data: cltAllowance} = useReadContract({
      ...contracts.cltToken,
      functionName: "allowance",
      args: [connectedAccount ?? zeroAddress, contracts.borrowFi.address]
  })

  const addCLT = async () => {
      const parsedAmount =  parseEther(cltInput)
      const _addClt = async () => {
          if (userCLT && userCLT >= parsedAmount) {
            const txHash = await writeContractAsync({
                ...contracts.borrowFi,
                functionName: "addCollateral",
                args: [parsedAmount]
            })
              if (txHash) {
                  alert("Add Collateral Successful!")
              } else {
                  throw new Error("Add Collateral failed!")
              }

          } else {
              throw new Error("Insufficient CLT");
          }
      }

      try {
        if (parsedAmount > (cltAllowance?? BigInt(0n))) {
           const txHash = await writeContractAsync({
                ...contracts.cltToken,
                functionName: "approve",
                args: [contracts.borrowFi.address, parsedAmount],
           });

           if (txHash) {
              await _addClt()
           }
        } else {
            await _addClt()
        }
        } catch (err) {
          console.error(err);
        }
  }


  return (
    <div className="px-8 grid gap-4">
      <div>
          <p>User's Collateral: {formatEther(userCollateral ?? BigInt(0))}</p>
          <p>User's Loan: {formatEther(userLoan ?? BigInt(0))}</p>
          <p>User's CLT Balance: {formatEther(userCLT ?? BigInt(0))}</p>
          <p>User's BFI Balance: {formatEther(userBFI ?? BigInt(0))}</p>
          <p>LTC of user: {Number(userLTC ?? 0)}</p>
      </div>
        <div>
           <p>Available Borrow Token: {formatEther(availableBorrow ?? BigInt(0))}</p>
           <p>Residual Collateral: {formatEther(availableCLT ?? BigInt(0))}</p>
            <p>Total Borrowed: {formatEther(totalBorrowed ?? BigInt(0))}</p>
            <p>Total Collateral: {formatEther(totalCollateral ?? BigInt(0))}</p>
        </div>

        <div className="flex items-center gap-4">
            <p>Add Collateral</p>
            <input className="border-1" type={"number"} value={cltInput} onChange={(e) => setCltInput(e.target.value)} />
            <button className="bg-blue-400 px-2 py-1 rounded-sm" onClick={addCLT}>Add</button>
        </div>
    </div>
  );
};

export default Main;
