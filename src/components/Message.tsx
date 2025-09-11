import React from "react";

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

const Message: React.FC<MessageProps> = ({
  message,
  type = "info",
  className = "",
}) => {
  if (!message) return null;
  return (
    <div
      className={`w-full px-4 py-2 border rounded-lg shadow-sm text-sm font-medium my-2 transition-all duration-200 animate-fade-in-out ${typeStyles[type]} ${className}`}
      role="alert"
    >
      {message}

        <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Message;
