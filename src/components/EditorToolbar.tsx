import React from 'react';
import {
  Save,
  Eye,
  Download,
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  Loader2,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import { ViewMode } from '../types/newsletter';
import { formatSaveTime } from '../utils/timeUtils';

interface EditorToolbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onPreview: () => void;
  onExport: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  autoSaveStatus: 'saving' | 'saved' | 'unsaved' | 'error';
  lastSaveTime: Date | null;
  autoSaveEnabled: boolean;
  onToggleAutoSave: () => void;
  onRetryAutoSave: () => void;
  isSaving?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  viewMode,
  setViewMode,
  onPreview,
  onExport,
  onSave,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  autoSaveStatus,
  lastSaveTime,
  autoSaveEnabled,
  onToggleAutoSave,
  onRetryAutoSave,
  isSaving = false
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">Newsletter Editor</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 text-gray-600 hover:text-gray-900 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-600 transition-all duration-150 rounded"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button 
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 text-gray-600 hover:text-gray-900 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-600 transition-all duration-150 rounded"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Selector */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                viewMode === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                viewMode === 'tablet' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                viewMode === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={onPreview}
            className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:bg-gray-100 transition-all duration-150"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          
          <button 
            onClick={onExport}
            className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:bg-gray-100 transition-all duration-150"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          
          {/* Auto-save Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs">
              {autoSaveStatus === 'saving' && (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span className="text-blue-600">Saving...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <Wifi className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">
                    {lastSaveTime ? `Saved ${formatSaveTime(lastSaveTime)}` : 'Saved'}
                  </span>
                </>
              )}
              {autoSaveStatus === 'unsaved' && (
                <>
                  <Clock className="w-3 h-3 text-orange-600" />
                  <span className="text-orange-600">Unsaved changes</span>
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <WifiOff className="w-3 h-3 text-red-600" />
                  <span className="text-red-600">Save failed</span>
                  <button
                    onClick={onRetryAutoSave}
                    className="text-red-600 hover:text-red-700 underline"
                    title="Retry save"
                  >
                    Retry
                  </button>
                </>
              )}
            </div>
            
            {/* Auto-save toggle */}
            <button
              onClick={onToggleAutoSave}
              className={`p-1 rounded transition-all duration-150 ${
                autoSaveEnabled 
                  ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                  : 'text-gray-400 hover:text-gray-500 hover:bg-gray-50'
              }`}
              title={autoSaveEnabled ? 'Auto-save enabled' : 'Auto-save disabled'}
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={onSave}
            disabled={isSaving}
            className={`flex items-center px-4 py-2 rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isSaving 
                ? 'bg-blue-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;