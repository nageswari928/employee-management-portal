import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export const Dialog = ({ open, onClose, children, title, id }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id={id}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />
      {/* Dialog Card */}
      <div 
        className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-xl animate-in fade-in zoom-in duration-200 text-foreground"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={onClose}
            data-testid="close-employee-modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
