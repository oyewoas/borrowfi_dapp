import React, { useState } from "react";

interface MessageProps {
  message?: string;
  type?: "success" | "error" | "info" | "warning";
  className?: string;
}

const typeStyles: Record<string, string> = {
  success: "bg-green-50 border-green-400 text-green-700",
  error: "bg-red-50 border-red-400 text-red-700",
  info: "bg-blue-50 border-blue-400 text-blue-700",
  warning: "bg-yellow-50 border-yellow-400 text-yellow-700",
};

const Message: React.FC<MessageProps> = ({ message, type = "info", className = "" }) => {
  const [visible, setVisible] = useState(true);

  if (!message || !visible) return null;

  return (
    <div
      className={`w-full px-4 py-2 border rounded-lg shadow-sm text-sm font-medium my-2 flex justify-between items-start ${typeStyles[type]} ${className}`}
      role="alert"
    >
<span className="whitespace-pre-wrap break-words">{message}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-gray-500 hover:text-gray-700 font-bold flex-shrink-0"
        aria-label="Clear message"
      >
        ✕
      </button>
    </div>
  );
};

export default Message;
