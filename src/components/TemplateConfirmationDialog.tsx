import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Template } from '../types/newsletter';

interface TemplateConfirmationDialogProps {
  isOpen: boolean;
  template: Template | null;
  isApplying: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TemplateConfirmationDialog: React.FC<TemplateConfirmationDialogProps> = ({
  isOpen,
  template,
  isApplying,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Apply Template: {template.name}
            </h3>
          </div>
          
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="text-sm text-yellow-800">
                <p className="font-medium">This action will:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Replace all existing content blocks</li>
                  <li>Apply your brand colors and fonts</li>
                  <li>Save current state to undo history</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={isApplying}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isApplying}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply Template'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateConfirmationDialog;