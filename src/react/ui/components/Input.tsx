import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

import { cn } from '../../utils/cn.ts';
import { colors } from '../tokens.ts';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: ReactNode;
  hint?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ iconLeft, hint, className, wrapperClassName, ...props }, ref) => (
    <div className={cn('w-full', wrapperClassName)}>
      <div
        className={cn(
          'flex w-full items-center gap-3 rounded-2xl transition focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--surface)]'
        )}
        style={{
          backgroundColor: 'var(--accent)',
          border: `1px solid ${colors.border}`,
        }}
      >
        {iconLeft && (
          <span
            className="pl-4 flex items-center justify-center text-opacity-80"
            style={{ color: colors.primary }}
          >
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          className={cn(
            'flex-1 bg-transparent outline-none py-3 text-sm placeholder:text-[color:var(--text-muted)]',
            iconLeft ? 'pr-4' : 'px-4',
            'text-[color:var(--foreground)]',
            className
          )}
          style={{
            fontFamily: 'inherit',
            caretColor: colors.primary,
          }}
        />
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
);
Input.displayName = 'Input';
