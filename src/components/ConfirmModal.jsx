const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-sm w-full sm:w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold leading-none focus:outline-none cursor-pointer"
          aria-label="Đóng"
        >
          &times;
        </button>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-200 cursor-pointer text-sm sm:text-base"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 cursor-pointer text-sm sm:text-base"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
