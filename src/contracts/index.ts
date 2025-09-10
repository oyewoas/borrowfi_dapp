import { erc20Abi, type Abi, type Address } from "viem";
import borrowFiAbi from "./abis/borrowFi";

type TContracts = Record<
  string,
  {
    address: Address;
    abi: Abi;
  }
>;

const contracts = {
  borrowFi: {
    address: "0x31c14fcbD235bf3617EcA5a3A548f7F000d61eC0",
    abi: borrowFiAbi,
  },
  cltToken: {
    address: "0x38cd4AA34a495f6ACA8b04401860F82C93563F99",
    abi: erc20Abi,
  },
  borrowToken: {
    address: "0x10EB53ea44C9A493874cE0279b8Db9C460f3EfA4",
    abi: erc20Abi,
  },
} as const satisfies TContracts;

export default contracts;
