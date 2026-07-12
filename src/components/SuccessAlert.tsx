import React from "react";

interface SuccessAlertProps {
  message: string | null;
  onClose: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="max-w-4xl mx-auto bg-green-100 border-2 border-green-300 text-green-800 p-4 rounded-2xl mb-6 flex items-center justify-between shadow-md animate-bounce text-xs font-bold leading-normal">
      <span>{message}</span>
      <button onClick={onClose} className="text-green-900 font-black shrink-0 hover:scale-110 ml-4">
        Xóa
      </button>
    </div>
  );
};
