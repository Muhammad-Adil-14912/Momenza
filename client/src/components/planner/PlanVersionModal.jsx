import { Clock, History, RotateCcw, X } from 'lucide-react';
import React from 'react';
import { formatDate } from '../../utils/formatters';

const PlanVersionModal = ({
  isOpen,
  onClose,
  versions = [],
  currentVersion = 1,
  onRestoreVersion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#252522]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#FAF9F6] p-5 border-b border-[#EAE8E2] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center text-[#C47B62]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#252522]">Plan Version History</h3>
              <p className="text-xs text-[#85847F]">Compare and restore previous AI iterations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#85847F] hover:text-[#252522] rounded-full hover:bg-[#F1EDE5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {versions.map((ver) => {
            const isCurrent = ver.version === currentVersion;
            return (
              <div
                key={ver.version}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-[#C47B62] bg-[#FAF9F6]'
                    : 'border-[#EAE8E2] bg-white hover:border-[#85847F]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-serif font-bold text-[#252522]">
                      Version {ver.version}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] bg-[#C47B62] text-white px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#85847F]">
                    {formatDate(ver.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-[#85847F] mt-1 font-light">
                  {ver.summary || 'AI Curated iteration'}
                </p>

                {!isCurrent && (
                  <div className="mt-3 pt-2 border-t border-[#EAE8E2] flex justify-end">
                    <button
                      onClick={() => onRestoreVersion(ver.version)}
                      className="text-xs text-[#C47B62] hover:underline flex items-center space-x-1 font-medium"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore this version</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanVersionModal;
