import React from 'react';
import { clsx } from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={selectId} className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
        {label}
      </label>
      <select
        id={selectId}
        className={clsx(
          'w-full px-3.5 py-2.5 font-mono text-sm neo-input focus:bg-amber-50 dark:focus:bg-zinc-800 transition-colors cursor-pointer',
          error && 'border-red-600 bg-red-50 dark:bg-red-950/30',
          className
        )}
        aria-invalid={!!error}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-xs font-bold text-red-600 dark:text-red-400 mt-0.5">⚠ {error}</span>
      ) : helperText ? (
        <span className="text-xs text-zinc-600 dark:text-zinc-400">{helperText}</span>
      ) : null}
    </div>
  );
};
