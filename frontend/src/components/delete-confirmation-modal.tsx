type DeleteConfirmationModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemName: string;
  itemCode?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmationModal({
  isOpen,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item?',
  itemName,
  itemCode,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed -inset-4 bg-black/40 z-[60] flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-4'>
        <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
        <p className='text-sm text-gray-600'>{description}</p>
        <div className='rounded-lg border border-gray-200 bg-gray-50 p-3'>
          <p className='text-sm text-gray-900 font-medium'>{itemName}</p>
          {itemCode ? (
            <p className='text-xs text-gray-500 font-mono'>{itemCode}</p>
          ) : null}
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className='px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
