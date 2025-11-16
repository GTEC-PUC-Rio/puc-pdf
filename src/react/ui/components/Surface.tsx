import { HTMLAttributes, ReactNode } from 'react';

import { colors, radii, shadow } from '../tokens.ts';
import { cn } from '../../utils/cn.ts';

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md';
  border?: boolean;
}

const paddingMap = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowMap = {
  none: 'none',
  sm: shadow.sm,
  md: shadow.md,
};

export const Surface = ({
  children,
  padding = 'md',
  elevation = 'sm',
  border = true,
  className,
  ...props
}: SurfaceProps) => (
  <div
    {...props}
    className={cn(paddingMap[padding], className)}
    style={{
      backgroundImage: `linear-gradient(135deg, ${colors.surfaceAlt}, ${colors.surface})`,
      border: border ? `1px solid ${colors.border}` : undefined,
      boxShadow: shadowMap[elevation],
      borderRadius: radii.xl,
    }}
  >
    {children}
  </div>
);
