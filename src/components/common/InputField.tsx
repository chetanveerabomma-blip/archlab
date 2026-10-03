import React from 'react';
import { clsx } from 'clsx';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  unit?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  unit,
  className,
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={inputId}
          className={clsx(
            'w-full px-3.5 py-2.5 font-mono text-sm neo-input focus:bg-amber-50 dark:focus:bg-zinc-800 transition-colors',
            error && 'border-red-600 bg-red-50 dark:bg-red-950/30',
            unit && 'pr-14',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-desc` : undefined}
          {...props}
        />
        {unit && (
          <span className="absolute right-3 font-mono font-bold text-xs text-zinc-600 dark:text-zinc-400 pointer-events-none bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 border border-black/30">
            {unit}
          </span>
        )}
      </div>
      {error ? (
        <span id={`${inputId}-error`} className="text-xs font-bold text-red-600 dark:text-red-400 mt-0.5">
          ⚠ {error}
        </span>
      ) : helperText ? (
        <span id={`${inputId}-desc`} className="text-xs text-zinc-600 dark:text-zinc-400">
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
