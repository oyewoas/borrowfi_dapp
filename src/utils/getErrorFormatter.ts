import { BaseError } from "wagmi";

export const getErrorFormatter = (error: unknown): string => {
    console.log("Error received in getErrorFormatter:", error);
  if (typeof error === "string") {
    return error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if(error instanceof BaseError) {
      return error.shortMessage;
    }
    return "An unknown error occurred";
};