interface ExitModalProps {
  onStay: () => void;
  onLeave: () => void;
}

export function ExitModal({ onStay, onLeave }: ExitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Leave this page?</h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Your booking is not complete. Are you sure you want to leave?
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onStay}
            className="order-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:order-1 sm:px-6"
          >
            Stay on Page
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="order-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:order-2 sm:px-6"
          >
            Leave Page
          </button>
        </div>
      </div>
    </div>
  );
}
