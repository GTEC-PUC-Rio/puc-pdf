import { ButtonHTMLAttributes, ReactNode } from 'react';

import { colors, radii, shadow } from '../tokens.ts';
import { cn } from '../../utils/cn.ts';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantStyles: Record<Variant, { background: string; color: string; border?: string }> = {
  primary: {
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover})`,
    color: colors.text,
  },
  secondary: {
    background: colors.accent,
    color: colors.accentForeground,
    border: `1px solid ${colors.mutedBorder}`,
  },
  ghost: {
    background: 'transparent',
    color: colors.text,
    border: `1px solid ${colors.border}`,
  },
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: ButtonProps) => {
  const styles = variantStyles[variant];

  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      style={{
        background: styles.background,
        color: styles.color,
        borderRadius: radii.lg,
        border: styles.border,
        boxShadow: variant === 'ghost' ? 'none' : shadow.sm,
      }}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
