import { useEffect } from "react";

export default function Modal({ onClose, children }) {
  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        onClose();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
        {children}
      </div>
    </div>
  );
}