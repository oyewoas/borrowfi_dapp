import { BaseError } from "wagmi";

export const getErrorFormatter = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if(error instanceof BaseError) {
      return error.shortMessage;
    }
    return "An unknown error occurred";
};