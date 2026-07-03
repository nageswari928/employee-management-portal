import React from 'react';

export const Switch = ({ id, checked, onChange, 'data-testid': testId, className = '' }) => {
  return (
    <label className={`relative inline-flex items-center cursor-pointer select-none ${className}`}>
      <input
        type="checkbox"
        id={id}
        data-testid={testId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 dark:after:border-zinc-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
    </label>
  );
};
