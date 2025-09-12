import React from 'react';
import { Save, Loader2 } from 'lucide-react';

interface SaveDialogProps {
  isOpen: boolean;
  newsletterName: string;
  isSaving: boolean;
  saveError: string | null;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  isOpen,
  newsletterName,
  isSaving,
  saveError,
  onNameChange,
  onSave,
  onCancel
}) => {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSaving && newsletterName.trim()) {
      onSave();
    }
    if (e.key === 'Escape' && !isSaving) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Newsletter</h3>
          <p className="text-gray-600 mb-4">
            Enter a name for your newsletter to save it.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Newsletter Name
            </label>
            <input
              type="text"
              value={newsletterName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter newsletter name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSaving}
              autoFocus
              onKeyDown={handleKeyDown}
            />
            {saveError && (
              <p className="mt-2 text-sm text-red-600">{saveError}</p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSaving || !newsletterName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Newsletter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveDialog;