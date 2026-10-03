import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { copyTextToClipboard } from '../../lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl: string;
  exportText?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  shareUrl,
  exportText,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    const success = await copyTextToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyText = async () => {
    if (!exportText) return;
    const success = await copyTextToClipboard(exportText);
    if (success) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#facc15] max-w-lg w-full p-6 relative">
        <div className="flex items-center justify-between mb-4 pb-3 border-b-3 border-black">
          <div className="flex items-center gap-2 font-black text-lg uppercase tracking-wide">
            <Share2 className="w-6 h-6 text-yellow-500" />
            <span>Share & Export: {title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 font-black border-2 border-black bg-rose-400 hover:bg-rose-500 text-black flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          {/* Shareable Link */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Shareable URL Link (Inputs Encoded)
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="w-full text-xs font-mono p-2 neo-input bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 neo-btn bg-cyan-400 hover:bg-cyan-500 text-black flex items-center gap-1.5 text-xs whitespace-nowrap"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Export Text */}
          {exportText && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                Formatted Text Export
              </label>
              <textarea
                readOnly
                rows={5}
                value={exportText}
                className="w-full text-xs font-mono p-2.5 neo-input bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCopyText}
                  className="px-4 py-2 neo-btn bg-lime-400 hover:bg-lime-500 text-black flex items-center gap-1.5 text-xs"
                >
                  {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedText ? 'Copied Summary' : 'Copy Text'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2 border-t-2 border-black/20 flex justify-between items-center">
            <span className="text-xs text-zinc-500">Press Print to generate PDF</span>
            <button
              onClick={handlePrint}
              className="px-4 py-2 neo-btn bg-amber-400 hover:bg-amber-500 text-black text-xs uppercase"
            >
              Export as PDF / Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
